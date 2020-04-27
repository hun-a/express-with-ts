import postModel from "../posts/posts.model";
import User from "./user.interface";
import UserNotFoundException from "../exceptions/UserNotFoundException";

export default class UserService {
  private post = postModel;

  public getAllPostsOfUser = async (userId: string, user: User) => {
    if (userId === user._id.toString()) {
      const posts = await this.post.find({ author: userId });
      return posts;
    } else {
      throw new UserNotFoundException(userId);
    }
  }
}