import { Routes } from '@angular/router';
import { AchievementsComponent } from './pages/achievements/achievements.component';
import { AchievementComponent } from './pages/achievement/achievement.component';

export const routes: Routes = [
	{
		path: 'achievements',
		component: AchievementsComponent,
	},
	{
		path: 'achievement/:id',
		component: AchievementComponent,
	},
];
