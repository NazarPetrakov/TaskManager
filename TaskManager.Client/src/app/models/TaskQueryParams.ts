import { ProgressStatus } from "../_helpers/enums/progressStatus";
import { User } from "./User";

export class TaskParams{
    userId?: string;
    status?: ProgressStatus ;
    excludeStatus? :ProgressStatus;
    pageNumber = 1;
    pageSize = 15;
    orderBy = 'createdAt_desc'

    constructor(user: User | null){
        this.userId = user?.id;
    }
}
