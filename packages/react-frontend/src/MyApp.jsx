import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([ ]);
	
  function removeOneCharacter(index) {
    const deleteUserBackend = fetch("http://localhost:8000/users/" + characters[index].id, {
		method: "DELETE",
	})
	.then(res => res.json())
	.then(res => console.log(res));
	
    const updated = characters.filter((character, i) => {
      return i !== index;
    });
    setCharacters(updated);
  }
  
  function updateList(person, res) {
    postUser(person)
      .then((res) => 
	  {if (res.status === 201) 
			setCharacters([...characters, person]);
	  })
      .catch((error) => {
        console.log(error);
      });
  }
  
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }
  
  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });

    return promise;
  }
  
  useEffect(() => {
  fetchUsers()
	  .then((res) => res.json())
	  .then((json) => setCharacters(json["users_list"]))
	  .catch((error) => { console.log(error); });
  }, [] );

  return (
    <div className="container">
      <Table
		characterData={characters}
		removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit = {updateList}/>
	</div>
  );
}

export default MyApp;