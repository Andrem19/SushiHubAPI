export interface IUserSave {
    Point: number;
    TelegramBotChatId?: any;
    AcumDiscount: boolean;
    OldSumOfOrder: number;
    SumOfOrders: number;
    MyRefCode: string;
    RefCodeOfMyRefer: string;
    RefDiscount: number;
    Id: number;
    UserName: string;
    NormalizedUserName: string;
    Email: string;
    NormalizedEmail: string;
    EmailConfirmed: boolean;
    PasswordHash: string;
    SecurityStamp: string;
    ConcurrencyStamp: string;
    PhoneNumber?: any;
    PhoneNumberConfirmed: boolean;
    TwoFactorEnabled: boolean;
    LockoutEnd?: any;
    LockoutEnabled: boolean;
    AccessFailedCount: number;
}