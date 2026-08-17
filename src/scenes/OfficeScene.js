import Phaser from 'phaser';

import {
  WORLD_W,
  WORLD_H,
  PLAYER_SIZE,
  PLAYER_SPEED,
  STAT_LABELS,
  WORKDAY_END_HOUR,
} from '../config/constants.js';

import { INTERACTIONS } from '../config/interactions.js';
import { EVENTS, EVENT_COOLDOWN_MS } from '../config/events.js';

import {
  WALL_SEGMENTS,
  DESKS,
  INTERACTION_SPOTS,
  NPCS,
  PLAYER_START,
} from '../config/officeLayout.js';

import GameState from '../systems/GameState.js';

import {
  WORKDAY_SITUATIONS,
  RECOVERY_EVENT,
} from '../config/workdays.js';

import { buildOfficeVisuals } from '../graphics/OfficeVisuals.js';
import { createEmployeeVisual } from '../graphics/EmployeeVisual.js';
import { createNPCVisual } from '../graphics/NPCVisuals.js';

import {
  createInteractionVisual,
  dimInteractionVisual,
  restoreInteractionVisual,
} from '../graphics/InteractionVisuals.js';

import GameHUD from '../ui/GameHUD.js';
import EventModal from '../ui/EventModal.js';
import CareerSetup from '../ui/CareerSetup.js';

import { PALETTE } from '../graphics/palette.js';

export default class OfficeScene extends Phaser.Scene {
  constructor() {
    super('OfficeScene');
  }

  // ─────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────

  create() {
    this.state = new GameState();

    this.interactables = [];
    this.npcs = [];

    // Build the world.
    buildOfficeVisuals(this);
    this.createWalls();
    this.createDesks();
    this.createPlayer();
    this.createInteractables();
    this.createNPCs();

    // UI.
    this.hud = new GameHUD(this);
    this.eventModal = new EventModal(this);
    this.careerSetup = new CareerSetup(this);

    // Keyboard.
    this.cursors = this.input.keyboard.createCursorKeys();

    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.interactKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    );

    // World physics.
    this.physics.world.setBounds(
      0,
      0,
      WORLD_W,
      WORLD_H
    );

    // ─────────────────────────────────────────
    // CAMERA
    // ─────────────────────────────────────────

    this.cameras.main.setBounds(
      0,
      0,
      WORLD_W,
      WORLD_H
    );
    
    // Show a proper close-up of the office.
    // The world is 1600x1200, while the viewport is 800x600.
    this.cameras.main.setZoom(1);
    
    this.cameras.main.startFollow(
      this.player,
      true,
      0.08,
      0.08
    );
    
    this.cameras.main.setRoundPixels(true);

    // Start with the player centered.
    this.cameras.main.centerOn(
      this.player.x,
      this.player.y
    );

    this.refreshHUD();

    // Show career creation before the workday begins.
    this.showCareerSetup();
  }

  // ─────────────────────────────────────────
  // WORLD
  // ─────────────────────────────────────────

  createWalls() {
    this.walls = this.physics.add.staticGroup();

    WALL_SEGMENTS.forEach(([x, y, w, h]) => {
      const wall = this.add
        .rectangle(
          x,
          y,
          w,
          h,
          0x000000,
          0
        )
        .setDepth(50);

      this.physics.add.existing(
        wall,
        true
      );

      wall.body.setSize(w, h);
      wall.body.setOffset(0, 0);

      this.walls.add(wall);
    });
  }

  createDesks() {
    this.obstacles = this.physics.add.staticGroup();

    DESKS.forEach(([x, y, w, h]) => {
      const desk = this.add
        .rectangle(
          x,
          y,
          w,
          h,
          0x000000,
          0
        )
        .setDepth(50);

      this.physics.add.existing(
        desk,
        true
      );

      desk.body.setSize(w, h);
      desk.body.setOffset(0, 0);

      this.obstacles.add(desk);
    });
  }

  // ─────────────────────────────────────────
  // PLAYER
  // ─────────────────────────────────────────

  createPlayer() {
    this.player = this.add.rectangle(
      PLAYER_START.x,
      PLAYER_START.y,
      PLAYER_SIZE,
      PLAYER_SIZE,
      0x000000,
      0
    );

    this.physics.add.existing(
      this.player
    );

    this.player.body.setCollideWorldBounds(
      true
    );

    this.player.body.setSize(
      PLAYER_SIZE,
      PLAYER_SIZE
    );

    this.playerVisual =
      createEmployeeVisual(
        this,
        PLAYER_START.x,
        PLAYER_START.y
      );

    // Player cannot walk through walls.
    this.physics.add.collider(
      this.player,
      this.walls
    );

    // Player cannot walk through desks.
    this.physics.add.collider(
      this.player,
      this.obstacles
    );
  }

  // ─────────────────────────────────────────
  // INTERACTABLES
  // ─────────────────────────────────────────

  createInteractables() {
    INTERACTION_SPOTS.forEach(
      ({ interactionId, x, y }) => {
        const data =
          INTERACTIONS[interactionId];

        const zone = this.add
          .circle(
            x,
            y,
            24,
            0x000000,
            0
          )
          .setDepth(50);

        this.physics.add.existing(
          zone
        );

        zone.body.setCircle(24);
        zone.body.setImmovable(true);
        zone.body.moves = false;

        const visual =
          createInteractionVisual(
            this,
            interactionId,
            x,
            y,
            data.label
          );

        this.interactables.push({
          zone,
          visual,
          data,
          cooldownUntil: 0,
        });
      }
    );
  }

  // ─────────────────────────────────────────
  // NPCS
  // ─────────────────────────────────────────

  createNPCs() {
    this.npcs = NPCS.map((npc) => ({
      ...npc,

      visual: createNPCVisual(
        this,
        npc
      ),

      cooldownUntil: 0,
    }));
  }

  // ─────────────────────────────────────────
  // HUD
  // ─────────────────────────────────────────

  refreshHUD() {
    const profile =
      this.state.careerProfile;

    this.hud.refresh(
      this.state.stats,
      this.state.formatClock(),
      profile && {
        day: this.state.day,
        industry: profile.industry,
        project: this.state.project,
        situation:
          this.state.currentSituation?.label,
      }
    );
  }

  // ─────────────────────────────────────────
  // CAREER SETUP
  // ─────────────────────────────────────────

  showCareerSetup() {
    this.careerSetup.show(
      (profile) => {
        this.state.setCareerProfile(
          profile
        );

        this.startWorkday();
      }
    );
  }

  // ─────────────────────────────────────────
  // WORKDAY
  // ─────────────────────────────────────────

  startWorkday() {
    const situation =
      WORKDAY_SITUATIONS[
        this.state.day
      ];

    if (!situation) {
      this.hud.showMessage(
        'Day 2 complete. More workdays are coming soon.'
      );

      this.refreshHUD();

      return;
    }

    this.state.beginWorkday({
      label: 'Explore the office',
    });

    this.refreshHUD();

    this.hud.showMessage(
      `Day ${this.state.day}: explore the office and follow up on Employee Portal.`
    );
  }

  // ─────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────

  update(_time, delta) {
    if (this.state.gameOver) {
      return;
    }

    if (!this.state.careerProfile) {
      return;
    }

    this.state.tickClock(delta);

    this.handleMovement();

    this.syncPlayerVisual();

    this.checkScriptedEvents();

    this.checkInteractions();

    this.checkNPCInteractions();

    this.checkWinLose();

    this.refreshHUD();
  }

  // ─────────────────────────────────────────
  // PLAYER VISUAL
  // ─────────────────────────────────────────

  syncPlayerVisual() {
    this.playerVisual.setPosition(
      this.player.x,
      this.player.y
    );
  }

  // ─────────────────────────────────────────
  // MOVEMENT
  // ─────────────────────────────────────────

  handleMovement() {
    const body =
      this.player.body;

    body.setVelocity(0);

    // Don't move while a choice/event is open.
    if (this.eventModal.isOpen) {
      return;
    }

    const left =
      this.cursors.left.isDown ||
      this.wasd.left.isDown;

    const right =
      this.cursors.right.isDown ||
      this.wasd.right.isDown;

    const up =
      this.cursors.up.isDown ||
      this.wasd.up.isDown;

    const down =
      this.cursors.down.isDown ||
      this.wasd.down.isDown;

    if (left) {
      body.setVelocityX(
        -PLAYER_SPEED
      );
    }

    if (right) {
      body.setVelocityX(
        PLAYER_SPEED
      );
    }

    if (up) {
      body.setVelocityY(
        -PLAYER_SPEED
      );
    }

    if (down) {
      body.setVelocityY(
        PLAYER_SPEED
      );
    }

    // Prevent diagonal movement from being faster.
    if (
      body.velocity.x !== 0 &&
      body.velocity.y !== 0
    ) {
      body.velocity
        .normalize()
        .scale(PLAYER_SPEED);
    }
  }

  // ─────────────────────────────────────────
  // OBJECT INTERACTIONS
  // ─────────────────────────────────────────

  checkInteractions() {
    if (this.eventModal.isOpen) {
      return;
    }

    this.interactables.forEach(
      (entry) => {
        if (
          !this.state.isInteractionAvailable(
            entry.data.eventId
          )
        ) {
          return;
        }

        if (
          this.time.now <
          entry.cooldownUntil
        ) {
          return;
        }

        if (
          this.physics.overlap(
            this.player,
            entry.zone
          )
        ) {
          this.triggerInteraction(
            entry
          );
        }
      }
    );
  }

  // ─────────────────────────────────────────
  // NPC INTERACTIONS
  // ─────────────────────────────────────────

  checkNPCInteractions() {
    if (this.eventModal.isOpen) {
      this.npcs.forEach((npc) => {
        npc.visual.prompt.setVisible(
          false
        );
      });

      return;
    }

    const nearbyNPC =
      this.npcs.find(
        (npc) =>
          this.isNPCInteractionAvailable(
            npc
          ) &&
          this.time.now >=
            npc.cooldownUntil &&
          Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            npc.x,
            npc.y
          ) <= 46
      );

    this.npcs.forEach((npc) => {
      npc.visual.prompt.setVisible(
        npc === nearbyNPC
      );
    });

    if (
      nearbyNPC &&
      Phaser.Input.Keyboard.JustDown(
        this.interactKey
      )
    ) {
      this.triggerNPCInteraction(
        nearbyNPC
      );
    }
  }

  isNPCInteractionAvailable(npc) {
    if (npc.id === 'rohit') {
      return (
        this.state.day === 1 &&
        !this.state.hasCompletedSituation(
          'deadlineMoved'
        )
      );
    }

    if (npc.id === 'priya') {
      return (
        this.state.day === 2 &&
        !this.state.hasCompletedSituation(
          'coworkerNeedsHelp'
        )
      );
    }

    return true;
  }

  triggerNPCInteraction(npc) {
    npc.cooldownUntil =
      this.time.now +
      EVENT_COOLDOWN_MS;

    npc.visual.container.setAlpha(
      0.45
    );

    npc.visual.name.setAlpha(
      0.45
    );

    npc.visual.prompt.setVisible(
      false
    );

    this.time.delayedCall(
      EVENT_COOLDOWN_MS,
      () => {
        npc.visual.container.setAlpha(
          1
        );

        npc.visual.name.setAlpha(
          1
        );
      }
    );

    const workSituation =
      npc.id === 'rohit'
        ? WORKDAY_SITUATIONS[1]
        : npc.id === 'priya' &&
          this.state.day === 2
          ? WORKDAY_SITUATIONS[2]
          : null;

    if (workSituation) {
      this.state.currentSituation =
        workSituation;

      this.refreshHUD();

      this.eventModal.show(
        workSituation,
        (choice) =>
          this.resolveWorkdayChoice(
            choice,
            workSituation.id
          )
      );

      return;
    }

    const event =
      EVENTS[npc.eventId];

    this.eventModal.show(
      event,
      (choice) => {
        this.resolveEventChoice(
          choice,
          npc.eventId,
          event.choices.indexOf(
            choice
          )
        );
      }
    );
  }

  // ─────────────────────────────────────────
  // OBJECT EVENT
  // ─────────────────────────────────────────

  triggerInteraction(entry) {
    entry.cooldownUntil =
      this.time.now +
      EVENT_COOLDOWN_MS;

    dimInteractionVisual(
      entry.visual
    );

    this.time.delayedCall(
      EVENT_COOLDOWN_MS,
      () =>
        restoreInteractionVisual(
          entry.visual
        )
    );

    const event =
      EVENTS[entry.data.eventId];

    this.eventModal.show(
      event,
      (choice) => {
        this.resolveEventChoice(
          choice,
          entry.data.eventId,
          event.choices.indexOf(
            choice
          )
        );
      }
    );
  }

  // ─────────────────────────────────────────
  // SCRIPTED EVENTS
  // ─────────────────────────────────────────

  checkScriptedEvents() {
    if (this.eventModal.isOpen) {
      return;
    }

    const event =
      this.state.getPendingScriptedEvent();

    if (!event) {
      return;
    }

    this.eventModal.show(
      event,
      (choice) =>
        this.resolveEventChoice(
          choice
        )
    );
  }

  // ─────────────────────────────────────────
  // EVENT RESULTS
  // ─────────────────────────────────────────

  resolveEventChoice(
    choice,
    eventId,
    choiceIndex
  ) {
    const changes =
      this.state.applyEffects(
        choice.effects
      );

    if (eventId) {
      this.state.recordChoice(
        eventId,
        choiceIndex
      );
    }

    changes.forEach(
      ({ stat, delta }) => {
        this.showFloatingText(
          stat,
          delta
        );
      }
    );

    this.refreshHUD();

    this.eventModal.showConsequences(
      changes
    );

    this.eventModal.closeAfter(
      1400
    );
  }

  resolveWorkdayChoice(
    choice,
    situationId
  ) {
    const changes =
      this.state.applyEffects(
        choice.effects
      );

    this.state.completeSituation(
      situationId
    );

    this.refreshHUD();

    this.eventModal.showConsequenceScreen(
      changes,
      () => {
        this.state.currentSituation = {
          label: 'Continue working',
        };

        this.refreshHUD();
      }
    );
  }

  // ─────────────────────────────────────────
  // RECOVERY
  // ─────────────────────────────────────────

  showRecovery() {
    this.eventModal.show(
      RECOVERY_EVENT,
      (choice) => {
        const changes =
          this.state.applyEffects(
            choice.effects
          );

        this.refreshHUD();

        this.eventModal.showConsequenceScreen(
          changes,
          () => {
            this.state.advanceDay();

            this.startWorkday();
          }
        );
      }
    );
  }

  // ─────────────────────────────────────────
  // FLOATING STAT TEXT
  // ─────────────────────────────────────────

  showFloatingText(
    stat,
    delta
  ) {
    const sign =
      delta > 0 ? '+' : '';

    const color =
      delta > 0
        ? '#00b894'
        : '#d63031';

    const text = this.add
      .text(
        this.player.x,
        this.player.y - 24,
        `${sign}${delta} ${stat}`,
        {
          fontFamily:
            'Arial, Helvetica, sans-serif',
          fontSize: '12px',
          color,
          fontStyle: 'bold',
          stroke: '#ffffff',
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5)
      .setDepth(100);

    this.tweens.add({
      targets: text,
      y: text.y - 40,
      alpha: 0,
      duration: 1200,
      onComplete: () =>
        text.destroy(),
    });
  }

  // ─────────────────────────────────────────
  // WIN / LOSE
  // ─────────────────────────────────────────

  checkWinLose() {
    if (
      this.state.gameMinutes >=
        WORKDAY_END_HOUR * 60 &&
      !this.state.endOfDayStarted
    ) {
      this.state.endOfDayStarted =
        true;

      this.showRecovery();

      return;
    }

    const result =
      this.state.checkEndConditions();

    if (result.ended) {
      this.endGame(
        result.won,
        result.title,
        result.message
      );
    }
  }

  // ─────────────────────────────────────────
  // END GAME
  // ─────────────────────────────────────────

  endGame(
    won,
    title,
    message
  ) {
    this.state.gameOver = true;

    this.player.body.setVelocity(0);

    // These are SCREEN coordinates,
    // not world coordinates.
    const screenWidth =
      this.scale.width;

    const screenHeight =
      this.scale.height;

    this.add
      .rectangle(
        screenWidth / 2,
        screenHeight / 2,
        screenWidth,
        screenHeight,
        0x000000,
        0.72
      )
      .setScrollFactor(0)
      .setDepth(200);

    const panel = this.add
      .rectangle(
        screenWidth / 2,
        screenHeight / 2,
        420,
        250,
        PALETTE.hudPanel,
        0.98
      )
      .setScrollFactor(0)
      .setDepth(201);

    panel.setStrokeStyle(
      2,
      won
        ? PALETTE.confidence
        : PALETTE.titleAccent
    );

    this.add
      .text(
        screenWidth / 2,
        screenHeight / 2 - 82,
        title,
        {
          fontFamily:
            'Arial, Helvetica, sans-serif',
          fontSize: '28px',
          color: won
            ? '#1dd1a1'
            : '#ff6b6b',
          fontStyle: 'bold',
          letterSpacing: 2,
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(202);

    this.add
      .text(
        screenWidth / 2,
        screenHeight / 2 - 30,
        message,
        {
          fontFamily:
            'Arial, Helvetica, sans-serif',
          fontSize: '15px',
          color: '#dfe6e9',
          align: 'center',
          wordWrap: {
            width: 360,
          },
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(202);

    const finalStats =
      Object.entries(
        this.state.stats
      )
        .map(
          ([stat, value]) =>
            `${STAT_LABELS[stat]}: ${Math.round(value)}`
        )
        .join('   ');

    this.add
      .text(
        screenWidth / 2,
        screenHeight / 2 + 28,
        finalStats,
        {
          fontFamily:
            'Arial, Helvetica, sans-serif',
          fontSize: '11px',
          color: '#f1f2f6',
          align: 'center',
          wordWrap: {
            width: 360,
          },
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(202);

    this.add
      .text(
        screenWidth / 2,
        screenHeight / 2 + 82,
        'Press R to restart',
        {
          fontFamily:
            'Arial, Helvetica, sans-serif',
          fontSize: '13px',
          color: '#747d8c',
          fontStyle: 'italic',
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(202);

    this.input.keyboard.once(
      'keydown-R',
      () => this.scene.restart()
    );
  }
}