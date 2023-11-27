export enum EmailType {
    EmailValidation = 0,
    ResetPassword = 1
}

export type UserStatistic = {
    totalSignedUpUsers: number
    totalActiveSessionToday: number
    averageSessionInLast7Days: number
  }