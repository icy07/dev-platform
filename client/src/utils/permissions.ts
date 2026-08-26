import type { UserRole } from "../types";

const ROLES: UserRole[] = [
	"Frontend Developer",
	"Backend Developer",
	"QA Engineer",
	"Designer",
	"HR",
	"Manager",
];

export const can = {
	createPost: (role: UserRole) => ROLES.includes(role),
	addPortfolio: (role: UserRole) => ROLES.includes(role),
	applyToVacancy: (role: UserRole) => ROLES.includes(role),

	createVacancy: (role: UserRole) => role === "HR",
	inviteUsers: (role: UserRole) => role === "HR",

	manageTeams: (role: UserRole) => role === "HR" || role === "Manager",
	manageProjects: (role: UserRole) => role === "Manager",
};
