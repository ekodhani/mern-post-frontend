import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useHistory, Link as RouterLink } from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import Link from "@material-ui/core/Link";
import { AuthContext } from "../helper/AuthContext";

function Home() {
  // inisialisasi nilai awal
  const [allPosts, setAllPosts] = useState([]); // nilai awal array kosong
  const [likedPost, setLikedPost] = useState([]); // diawal belum ada liked
  const { authContext } = useContext(AuthContext);

  // deklarasi useHistory
  let history = useHistory(); // redirect

  useEffect(() => {
    // cek ada token atau belum
    if (!localStorage.getItem("accessToken")) {
      history.push("/login"); // jika belum ada token maka diarahkan ke login
    } else {
      axios
        .get("http://localhost:8001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setAllPosts(response.data.allPosts);
          setLikedPost(
            response.data.likedPost.map((like) => {
              return like.PostId; // post yang sudah ada liked nya
            })
          );
        });
    }
  }, []);
  // useEffect dependencies
  // []: useEffect dijalankan satu kali diawal
  // [parameter]: useEffect dijalankan ketika terjadi perubahan pada parameter

  // tombol like
  const likePost = (postId) => {
    axios
      .post(
        "http://localhost:8001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        //alert(response.data);
        setAllPosts(
          allPosts.map((post) => {
            // === mambandingkan isinya dan tipe datanya
            // == membandingkan isinya saja
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );
        // mendeteksi post sudah ada liked atau belum
        if (likedPost.includes(postId)) {
          setLikedPost(
            likedPost.filter((id) => {
              return id != postId;
            })
          );
        } else {
          setLikedPost([...likedPost, postId]);
        }
      });
  };

  return (
    <div className="App">
      {allPosts.map((key, value) => {
        return (
          <div className="post">
            <div className="title">{key.title}</div>
            <div
              className="body"
              onClick={() => history.push(`/post/${key.id}`)}
            >
              {key.postText}
            </div>
            <div className="footer">
              <div className="username">
                <Link
                  component={RouterLink}
                  to={`/profile/${key.UserId}`}
                  variant="text"
                  color="inherit"
                >
                  {key.username}
                </Link>
              </div>
              <div className="buttons">
                <ThumbUpAltIcon
                  className={
                    likedPost.includes(key.id) ? "unlikeBttn" : "likeBttn"
                  }
                  onClick={() => {
                    likePost(key.id);
                  }}
                />
                <label>{key.Likes.length}</label>
              </div>
              <div className="likeslength"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
