export enum UserRole {
	USER = 1,
	ADMIN = 2,
}

export interface UserSocket {
	socket_id: string;
	user_id: null | number;
}
