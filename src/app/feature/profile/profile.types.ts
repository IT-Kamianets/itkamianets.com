/** Соціальні мережі профілю — довільний набір { ключ: url } */
export type ProfileSocials = Record<string, string>;

export interface Profile {
	_id: string;
	name: string;
	/** Основна роль (перша з масиву roles або явно задана) */
	role: string;
	avatar: string;
	isHead: boolean;
	socials: ProfileSocials;
	// Extended fields
	bio?: string;
	roles?: string[];
	achievements?: string[];
	/** ID підключених проєктів */
	projects?: string[];
	/** ID підключених івентів */
	events?: string[];
	/** ID компанії — потрібне для передачі в API create/update */
	company?: string;
	// Legacy-сумісні поля
	internshipDates?: string;
	university?: string;
}
