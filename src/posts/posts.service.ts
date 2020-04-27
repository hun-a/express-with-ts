import postModel from "./posts.model";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import Post from "./post.interface";
import CreatePostDto from "./post.dto";
import User from "../users/user.interface";


export default class PostsService {
  private post = postModel;

  public getAllPosts = async () => {
    const posts = await this.post.find().populate('author', '-password');
    return posts;
  }

  public getPostById = async (postId: string) => {
    const post = await this.post.findById(postId).populate('author', '-password');
    if (post) {
      return post;
    } else {
      throw new PostNotFoundException(postId);
    }
  }

  public modifyPost = async (postId: string, postData: Post) => {
    const post = await this.post.findByIdAndUpdate(postId, postData, { new: true });
    if (post) {
      return post;
    } else {
      throw new PostNotFoundException(postId);
    }
  }

  public deletePost = async (postId: string) => {
    const response = await this.post.findByIdAndDelete(postId);

    if (response) {
      return 200;
    } else {
      throw new PostNotFoundException(postId);
    }
  }

  public createPost = async (user: User, postData: CreatePostDto) => {
    const createdPost = new this.post({
      ...postData,
      author: user._id
    });
    const savedPost = await createdPost.save();
    await savedPost.populate('author', '-password').execPopulate();
    return savedPost;
  }
}