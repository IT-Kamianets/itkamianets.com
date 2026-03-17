import {
	EducationInstitution,
	EducationInstitutionDraft,
	EducationInstitutionOwnership,
	EducationInstitutionStatus,
	EducationInstitutionType,
} from './education.interface';

export const EDUCATION_TYPE_OPTIONS: ReadonlyArray<{
	value: EducationInstitutionType;
	label: string;
}> = [
	{ value: 'lyceum', label: 'Ліцей' },
	{ value: 'gymnasium', label: 'Гімназія' },
	{ value: 'kindergarten', label: 'Дитячий садок' },
	{ value: 'college', label: 'Коледж' },
	{ value: 'university', label: 'Університет' },
	{ value: 'art-school', label: 'Мистецька школа' },
];

export const EDUCATION_OWNERSHIP_OPTIONS: ReadonlyArray<{
	value: EducationInstitutionOwnership;
	label: string;
}> = [
	{ value: 'municipal', label: 'Комунальна' },
	{ value: 'state', label: 'Державна' },
	{ value: 'private', label: 'Приватна' },
];

export const EDUCATION_STATUS_OPTIONS: ReadonlyArray<{
	value: EducationInstitutionStatus;
	label: string;
}> = [
	{ value: 'active', label: 'Працює' },
	{ value: 'planned', label: 'Планується' },
	{ value: 'renovation', label: 'Оновлення' },
];

export const createEmptyEducationInstitutionDraft = (): EducationInstitutionDraft => ({
	name: '',
	shortName: '',
	type: 'lyceum',
	ownership: 'municipal',
	address: '',
	district: 'Камʼянець-Подільський',
	phone: '',
	email: '',
	website: '',
	principal: '',
	studentsCount: 0,
	foundedYear: 2000,
	status: 'active',
	featured: false,
	published: true,
	notes: '',
});

export const DEFAULT_EDUCATION_INSTITUTIONS: EducationInstitution[] = [
	{
		id: 'lyceum-16',
		name: 'Камʼянець-Подільський ліцей № 16',
		shortName: 'Ліцей № 16',
		type: 'lyceum',
		ownership: 'municipal',
		address: 'вул. Огієнка, 22',
		district: 'Центральний мікрорайон',
		phone: '+380 (3849) 3-21-16',
		email: 'lyceum16@itkamianets.com',
		website: 'https://education.itkamianets.com/lyceum16',
		principal: 'Олена Ковальчук',
		studentsCount: 940,
		foundedYear: 1987,
		status: 'active',
		featured: true,
		published: true,
		notes: 'Поглиблене вивчення англійської мови та STEM-напряму.',
		updatedAt: '2026-03-10T09:00:00.000Z',
	},
	{
		id: 'lyceum-9',
		name: 'Ліцей № 9 імені А. М. Трояна',
		shortName: 'Ліцей № 9',
		type: 'lyceum',
		ownership: 'municipal',
		address: 'просп. Грушевського, 48',
		district: 'Жовтневий масив',
		phone: '+380 (3849) 7-14-09',
		email: 'lyceum9@itkamianets.com',
		website: 'https://education.itkamianets.com/lyceum9',
		principal: 'Світлана Боднар',
		studentsCount: 1120,
		foundedYear: 1976,
		status: 'active',
		featured: true,
		published: true,
		notes: 'Сильний математичний профіль і розвинені спортивні секції.',
		updatedAt: '2026-03-08T08:30:00.000Z',
	},
	{
		id: 'kindergarten-17',
		name: 'Заклад дошкільної освіти № 17 «Світлячок»',
		shortName: 'ЗДО № 17',
		type: 'kindergarten',
		ownership: 'municipal',
		address: 'вул. Північна, 10',
		district: 'Північний мікрорайон',
		phone: '+380 (3849) 2-41-17',
		email: 'sadochok17@itkamianets.com',
		website: 'https://education.itkamianets.com/kindergarten17',
		principal: 'Наталія Стасюк',
		studentsCount: 210,
		foundedYear: 1994,
		status: 'active',
		featured: false,
		published: true,
		notes: 'Групи раннього розвитку та інклюзивна підтримка дітей.',
		updatedAt: '2026-03-05T12:15:00.000Z',
	},
	{
		id: 'pdu',
		name: 'Подільський державний університет',
		shortName: 'ПДУ',
		type: 'university',
		ownership: 'state',
		address: 'вул. Шевченка, 13',
		district: 'Старе місто',
		phone: '+380 (3849) 6-83-01',
		email: 'admission@itkamianets.com',
		website: 'https://education.itkamianets.com/pdu',
		principal: 'Ігор Марцінковський',
		studentsCount: 4200,
		foundedYear: 1919,
		status: 'active',
		featured: true,
		published: true,
		notes: 'Бакалаврські та магістерські програми для міста і регіону.',
		updatedAt: '2026-03-12T11:20:00.000Z',
	},
	{
		id: 'art-school',
		name: 'Камʼянець-Подільська дитяча художня школа',
		shortName: 'Художня школа',
		type: 'art-school',
		ownership: 'municipal',
		address: 'вул. Татарська, 18',
		district: 'Старе місто',
		phone: '+380 (3849) 9-11-32',
		email: 'artschool@itkamianets.com',
		website: 'https://education.itkamianets.com/art-school',
		principal: 'Лариса Мельник',
		studentsCount: 340,
		foundedYear: 1968,
		status: 'planned',
		featured: false,
		published: false,
		notes: 'Оновлення майстерень та запуск нових програм цифрової графіки.',
		updatedAt: '2026-03-14T15:45:00.000Z',
	},
];