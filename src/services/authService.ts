import { UserProfile, UserRegistrationInput } from "@/types";

export const authService = {
  async registerUser(input: UserRegistrationInput): Promise<UserProfile> {
    return Promise.resolve({
      id: "pending-firebase-id",
      displayName: input.displayName,
      email: input.email,
      role: input.role,
      interests: input.interests
    });
  }
};
