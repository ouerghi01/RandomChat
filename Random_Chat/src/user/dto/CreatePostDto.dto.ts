export class CreatePostDto {
  title: string;
  content: string;
  isAnonymous: boolean;
  userId: number;
  post_img: string;
}