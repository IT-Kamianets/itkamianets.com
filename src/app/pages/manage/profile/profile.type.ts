export type ProfileFormModel = {
	name: string;
	phone: string;
	bio: string;
};

export type ProfilePayload = Partial<ProfileFormModel> & Record<string, unknown>;
