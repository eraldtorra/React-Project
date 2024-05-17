

class ForumMessagesModel {
    id: number;
    content: string;
    postedBy: string;
    datePosted: string; 

    constructor(id: number, content: string, postedBy: string, datePosted: string){
        this.id = id;
        this.content = content;
        this.postedBy = postedBy;
        this.datePosted = datePosted;
    }
}
    
export default ForumMessagesModel;