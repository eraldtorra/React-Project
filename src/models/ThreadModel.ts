

class ThreadModel {
    
    id: number;
    date: string;
    title: string;
    creator: string;
    constructor(id: number ,date: string, title: string, creator: string) {
        this.id = id;
        this.date = date;
        this.title = title;
        this.creator = creator;
    }
}

export default ThreadModel;