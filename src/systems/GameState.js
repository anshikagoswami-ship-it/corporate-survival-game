import Phaser from 'phaser';
import {
  START_STATS,
  WORKDAY_START_HOUR,
  WORKDAY_END_HOUR,
  SECONDS_PER_HOUR,
} from '../config/constants.js';
import { INITIAL_PROJECT } from '../config/workdays.js';

export default class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.stats = { ...START_STATS };
    this.gameMinutes = WORKDAY_START_HOUR * 60;
    this.gameOver = false;
    this.won = false;
    this.careerProfile = null;
    this.day = 1;
    this.project = { ...INITIAL_PROJECT };
    this.currentSituation = null;
    this.completedSituations = new Set();
    this.endOfDayStarted = false;
    this.progress = {
      managerChoice: null,
      coworkerChoice: null,
      managerFollowUpShown: false,
      coworkerTipShown: false,
    };
  }

  tickClock(delta) {
    const minutesPerMs = (60 / SECONDS_PER_HOUR) / 1000;
    this.gameMinutes += delta * minutesPerMs;
    if (this.gameMinutes > WORKDAY_END_HOUR * 60) {
      this.gameMinutes = WORKDAY_END_HOUR * 60;
    }
  }

  applyEffects(effects) {
    const changes = [];
    Object.entries(effects).forEach(([stat, delta]) => {
      if (delta === 0) return;
      if (stat === 'projectProgress') {
        this.project.progress = Phaser.Math.Clamp(this.project.progress + delta, 0, 100);
        changes.push({ stat, delta });
        if (this.project.progress === 100 && !this.project.completed) {
          this.project.completed = true;
          this.stats.career = Phaser.Math.Clamp(
            this.stats.career + this.project.careerReward,
            0,
            100
          );
          changes.push({ stat: 'career', delta: this.project.careerReward });
        }
        return;
      }
      this.stats[stat] = Phaser.Math.Clamp(this.stats[stat] + delta, 0, 100);
      changes.push({ stat, delta });
    });
    return changes;
  }

  setCareerProfile(profile) {
    this.careerProfile = { ...profile };
    const goalBonuses = {
      'Career Growth': { career: 5 },
      Leadership: { confidence: 5 },
      'Work-Life Balance': { wellbeing: 5 },
    };
    this.applyEffects(goalBonuses[profile.goal]);
  }

  beginWorkday(situation) {
    this.currentSituation = situation;
    this.gameMinutes = WORKDAY_START_HOUR * 60;
    this.endOfDayStarted = false;
  }

  advanceDay() {
    this.day += 1;
    this.project.deadlineDays = Math.max(0, this.project.deadlineDays - 1);
    this.currentSituation = null;
  }

  hasCompletedSituation(id) {
    return this.completedSituations.has(id);
  }

  completeSituation(id) {
    this.completedSituations.add(id);
  }

  getPhase() {
    if (this.gameMinutes < 11 * 60) return 'morning';
    if (this.gameMinutes < 13 * 60) return 'lateMorning';
    if (this.gameMinutes < 14 * 60) return 'lunch';
    if (this.gameMinutes < 16 * 60 + 30) return 'afternoon';
    return 'endOfDay';
  }

  isInteractionAvailable(eventId) {
    const phase = this.getPhase();
    if (eventId === 'manager') return phase === 'morning' && this.progress.managerChoice === null;
    if (eventId === 'coworker') return phase === 'afternoon' && this.progress.coworkerChoice === null;
    return true;
  }

  recordChoice(eventId, choiceIndex) {
    if (eventId === 'manager') {
      this.progress.managerChoice = choiceIndex === 0 ? 'helped' : 'refused';
    }
    if (eventId === 'coworker') {
      this.progress.coworkerChoice = choiceIndex === 1 ? 'refused' : 'helped';
    }
  }

  getPendingScriptedEvent() {
    if (
      this.progress.managerChoice &&
      !this.progress.managerFollowUpShown &&
      this.gameMinutes >= 11 * 60
    ) {
      this.progress.managerFollowUpShown = true;
      const helped = this.progress.managerChoice === 'helped';
      return {
        label: 'Slack — Manager',
        situation: 'Manager: Can you also take this up?',
        choices: [{
          text: 'Acknowledge',
          effects: helped ? { career: 3, energy: -5 } : { career: -5, confidence: -2 },
        }],
      };
    }

    if (
      this.progress.coworkerChoice === 'helped' &&
      !this.progress.coworkerTipShown &&
      this.gameMinutes >= 14 * 60
    ) {
      this.progress.coworkerTipShown = true;
      return {
        label: 'Coworker',
        situation: 'Your coworker shares a useful tip that makes the rest of the day easier.',
        choices: [{ text: 'Thank them', effects: { confidence: 4 } }],
      };
    }

    return null;
  }

  checkEndConditions() {
    if (Object.values(this.stats).some((v) => v <= 0)) {
      return {
        ended: true,
        won: false,
        title: 'BURNT OUT',
        message: 'Congratulations. You have successfully turned employment into a biological event.',
      };
    }
    if (this.gameMinutes >= WORKDAY_END_HOUR * 60) {
      const { wellbeing, energy, career, confidence } = this.stats;
      if (energy < 20 || wellbeing < 20) {
        return { ended: true, won: false, title: 'BURNT OUT', message: 'Congratulations. You have successfully turned employment into a biological event.' };
      }
      if (career < 25) {
        return { ended: true, won: false, title: 'CAREER DISASTER', message: 'Your career has entered a new strategic direction: downward.' };
      }
      if (career >= 70 && confidence >= 65) {
        return { ended: true, won: true, title: 'THRIVING', message: 'You somehow survived the workday with your reputation intact.' };
      }
      return { ended: true, won: true, title: 'SURVIVED', message: 'You survived. You are not sure why this counts as an achievement.' };
    }
    return { ended: false };
  }

  formatClock() {
    const hours = Math.floor(this.gameMinutes / 60);
    const mins = Math.floor(this.gameMinutes % 60);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    const displayMins = mins.toString().padStart(2, '0');
    return `${displayHour}:${displayMins} ${ampm}`;
  }
}
