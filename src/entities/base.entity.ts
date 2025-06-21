export interface BaseEntity {
    id: number;
    isSuspended?: boolean;
    isCancelled?: boolean;
    createdAt?: Date;
    lastUpdatedAt?: Date;
    createdBy: number;
    lastUpdatedBy: number;
}
