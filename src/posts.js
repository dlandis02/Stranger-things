import { useHistory } from "react-router-dom";

const API_URL = 'https://strangers-things.herokuapp.com/api/2206-FTB-ET-WEB-FT-B'

const Posts = (props) => {
    const { userName, setAlertMessage, setPostID, setPostIndex } = props;
    const history = useHistory();

    const fetchPosts = async () => {
        try {
            const posts = await fetch(`${API_URL}/posts`);
            const postsResults = await posts.json();
            return postsResults.data.posts;

        } catch (err) {
            console.error('Unable to fetch posts', err);
        }
    }
    
    const renderPosts = (postList) => {
        let postsContainer = document.getElementById('posts-container')
    
        if (!postList) {
            postsContainer.innerHTML = "No posts to display"
            return;
        }
    
        let postsContainterHTML = '';
        for (let i = 0; i < postList.length; i++) {
            const post = postList[i];
            
            let postHTML = `
                <div class="single-post">
                    <div class="post-title">
                        <h2>${post.title}</h2>
                        <div class="send-message">
                            <button data-id=${post._id} class="view-post-button">${post.author.username === userName ? "VIEW MY POST" : "SEND MESSAGE"}</button>
                        </div>
                    </div>
                    <div class="post-description">
                        <p>${post.description}</p>
                    </div>
                    <div class="post-price">
                        <p>Price: ${post.price}</p>
                    </div>
                    <div class="post-location">
                        <p>Location: ${post.location}</p>
                    </div>
                    <div class="post-username">
                        <p>Seller: ${post.author.username}</p>
                    </div>
                </div>
            `;
    
            postsContainterHTML += postHTML;
        }

        postsContainer.innerHTML = postsContainterHTML;

        let viewPostButtons = [...document.getElementsByClassName('view-post-button')]
        for (let j = 0; j < viewPostButtons.length; j++) {
            const button = viewPostButtons[j];
            button.addEventListener('click', () => {
                setPostID(button.dataset.id)
                setPostIndex(j)
                history.push('/viewPost')
            });
        }
    }
    
    const initialPosts = async () => {
        const posts = await fetchPosts();
        renderPosts(posts);
    }

    initialPosts();
    
    return (
        <div className="posts">
            <h1>{ userName ? `Welcome back ${userName}!!` : `Welcome! Log in to get started!`}</h1>
            <div id="post-stuff">
                <div id="search-posts">
                    <input type='text' placeholder="Search Posts"></input>
                    <button>Search</button>
                </div>
                <div id="add-post">
                    <button onClick={() => {
                        if (userName) {
                            history.push('/newPost');
                        } else {
                            setAlertMessage("You must be logged in in order to make a post.");
                            history.push('/login')
                        }
                    }}>Create New Post</button>
                </div>
            </div>
            <div id='posts-container'></div>
        </div>
    )
}

export default Posts;