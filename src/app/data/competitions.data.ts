import { HackathonCard, HackathonDetail, HACKATHON_PAGE, HACKATHONS } from './hackathons.data';

export type CompetitionCard = HackathonCard;
export type CompetitionDetail = HackathonDetail;

export const COMPETITIONS: CompetitionCard[] = HACKATHONS.map((item) => ({
	...item,
	title: item.title.replace('Хакатон', 'Змагання'),
	cta: '/competition',
}));

export const COMPETITION_PAGE: CompetitionDetail = {
	...HACKATHON_PAGE,
	label: 'Змагання',
};

