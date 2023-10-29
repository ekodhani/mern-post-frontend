import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";

function DetailPost() {
  let { id } = useParams(); // mendeteksi id dari salah satu post yang dipilih
  const [postDetail, setPostDetail] = useState({}); // nilai awal object kosong
  const [comments, setComments] = useState([]); // diawal nilai comments masih kosong
  const [newComment, setNewComment] = useState(""); // diawal newComment masih kosong
  let history = useHistory();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    // mendapatkan 1 detail post
    axios.get(`http://localhost:8001/posts/byId/${id}`).then((response) => {
      setPostDetail(response.data); // postDetail diisi dengan response.data
    });
    // mendapatkan comments untuk per 1 detail post
    axios.get(`http://localhost:8001/comments/${id}`).then((response) => {
      setComments(response.data); // comments diisi dengan response.data
    });
  }, []); // di render sekali ketika halaman detail post dibuka

  // menambahkan comment kedalam post
  const addComment = () => {
    axios
      .post(
        "http://localhost:8001/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          // console.log(response.data.error);
          alert(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment(""); // reset input
        }
      });
  };

  // menghapus post milik username terkait
  const deletePost = (id) => {
    axios
      .delete(`http://localhost:8001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        history.push("/"); // ketika berhasil menghapus maka diarahkan ke home
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter new title:");
      axios.put(
        "http://localhost:8001/posts/title",
        {
          newTitle: newTitle,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );
      setPostDetail({ ...postDetail, title: newTitle });
    } else {
      let newPostText = prompt("Enter new text:");
      axios.put(
        "http://localhost:8001/posts/postText",
        {
          newText: newPostText,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );
      setPostDetail({ ...postDetail, postText: newPostText });
    }
  }

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div 
            className="title"
            onClick={() => {
              if (authState.username === postDetail.username) {
                editPost("title");
              }
            }}
          >
            {postDetail.title}
          </div>
          <div 
            className="body"
            onClick={() => {
              if (authState.username === postDetail.username) {
                editPost("body");
              }
            }}
          >
            {postDetail.postText}
          </div>
          <div className="footer">
            <label>{postDetail.username}</label>
            {authState.username === postDetail.username && (
              <button
                className="deleteBttn"
                onClick={() => {
                  deletePost(postDetail.id);
                }}
              >
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Enter your comment here"
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}>Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments &&
            comments.map((comment, value) => {
              return (
                <div className="comment" key={value}>
                  <p>
                    Comment: <strong>{comment.commentBody}</strong>
                  </p>
                  <p>
                    Username: <strong>{comment.username}</strong>
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default DetailPost;
