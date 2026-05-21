import { Routes } from '@angular/router';
import { adminGuard } from '../user/admin.guard';
import { ManageAchievementsComponent } from './pages/manage-achievements/manage-achievements.component';

export const routes: Routes = [
	{
		path: 'achievements',
		component: ManageAchievementsComponent,
		canActivate: [adminGuard],
	},
];
