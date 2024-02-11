import PostBox from "components/posts/PostBox";
import PostForm from "components/posts/PostForm";
export interface PostProps {
    id: string;
    email: string;
    content: string;
    createdAt: string;
    uid: string;
    profileUrl?: string;
    likes?: string[];
    likeCount?: number;
    comments?: any[];
}

const posts: PostProps[] = [
    { id: "1", email: "test@test.com", content: "내용", createdAt: "2024-02-09", uid: "12345" },
    { id: "2", email: "test@test.com", content: "내용", createdAt: "2024-02-09", uid: "12345" },
    { id: "3", email: "test@test.com", content: "내용", createdAt: "2024-02-09", uid: "12345" },
    { id: "4", email: "test@test.com", content: "내용", createdAt: "2024-02-09", uid: "12345" },
    { id: "5", email: "test@test.com", content: "내용", createdAt: "2024-02-09", uid: "12345" },
];

export default function Home() {
    return (
        <div className="home">
            <div className="home__top">
                <div className="home__title">Home</div>
                <div className="home__tabs">
                    <div className="home__tab home__tab--active">For You</div>
                    <div className="home__tab">Following</div>
                </div>
            </div>
            <PostForm />
            <div className="post">
                {posts.map((post) => (
                    <PostBox post={post} key={post.id} />
                ))}
            </div>
        </div>
    );
}
