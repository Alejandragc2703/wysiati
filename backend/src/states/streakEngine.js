/**
 * Motor de Cálculo de Rachas (Streak Engine)
 * Lógica para calcular días consecutivos de consistencia Bio-Sync
 */

class StreakEngine {
    static calculateStreak(dates) {
        if (!dates || dates.length === 0) return 0;
        // Lógica de cálculo comparando fechas consecutivas
        return dates.length; // Mock
    }

    static checkMilestone(currentStreak) {
        const milestones = [7, 14, 30, 90, 365];
        return milestones.find(m => m === currentStreak) || null;
    }
}

module.exports = StreakEngine;
