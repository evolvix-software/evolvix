export interface SettingsSection {
  id: string;
  label: string;
  icon: string;
}

export const settingsData = {
  settingsSections: {
    student: [
      {
        id: "basic",
        label: "Personal Information",
        icon: "User",
      },
      {
        id: "education",
        label: "Education & School",
        icon: "GraduationCap",
      },
      {
        id: "skills",
        label: "Skills & Interests",
        icon: "Award",
      },
      {
        id: "kyc",
        label: "KYC & Verification",
        icon: "Shield",
      },
      {
        id: "achievements",
        label: "Achievements",
        icon: "Trophy",
      },
      {
        id: "password",
        label: "Change Password",
        icon: "Key",
      },
      {
        id: "payment",
        label: "Payment Methods",
        icon: "CreditCard",
      },
      {
        id: "notifications-app",
        label: "Notifications",
        icon: "Bell",
      },
      {
        id: "account",
        label: "Account & Security",
        icon: "Lock",
      },
      {
        id: "privacy",
        label: "Privacy & Security",
        icon: "Shield",
      },
      {
        id: "preferences",
        label: "Preferences",
        icon: "Palette",
      }
    ] as SettingsSection[],
    mentor: [
      {
        id: "profile",
        label: "Profile Settings",
        icon: "User",
      },
      {
        id: "account",
        label: "Account & Security",
        icon: "Lock",
      },
      {
        id: "payout",
        label: "Payout & Financials",
        icon: "CreditCard",
      },
      {
        id: "notifications",
        label: "Notification Settings",
        icon: "Bell",
      },
      {
        id: "privacy",
        label: "Privacy & Security",
        icon: "Shield",
      },
      {
        id: "preferences",
        label: "Preferences",
        icon: "Palette",
      }
    ] as SettingsSection[]
  }
};

