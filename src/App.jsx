import { useEffect } from "react";
import { useState } from "react";
import DataTables from "./components/DataTables";

function App() {
  const [posts, setPosts] = useState();

  const fetchData = async () => {
//     fetch("https://dummyjson.com/posts")
    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((res) => res.json())
      .then((json) => {
        const data = json.posts;
        const newData = data.map((obj) => ({
          ...obj,
          tags: obj.tags.join(", "), // convert tags from array to string.
        }));
        setPosts(newData);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="block min-h-screen mx-4 py-4">
      <h1 className="text-3xl font-extrabold text-center mb-4">
        Mini Project - DataTables
      </h1>
      <DataTables data={posts} />
    </div>
  );
}

export default App;
