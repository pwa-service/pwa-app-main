export interface CommentData {
  id: number;
  type: "user" | "support";
  fullName: string;
  date: string;
  text: string;
}
