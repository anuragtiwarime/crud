# Getting Started with Frontend ReactJS

Create a react app with TailwindCSS

After it is done now inside the `src` directory create a folder named `components` where we will store all our components that we are going to create.

For this app we just need 2 components, so lets quickly create them inside `components` directory

```bash
touch Form.js UsersList.js
```

Now come back to `App.js` and do the following

```js
import "./App.css";
import Form from "./components/Form";
import UsersList from "./components/UsersList";

function App() {
  return (
    <div className="App">
      {/* Form Component */}
      <Form />
      {/* All users list */}
      <UsersList />
    </div>
  );
}

export default App;
```

In here we are importing both the components that we create.

Now we need to write the logic for our components

Let's start with the `Form.js` component

```js
const Form = () => {
  return <h1>Form</h1>;
};

export default Form;
```

We know we need a form here so lets create a form quickly

```js
<div>
  <form>
    <section className="text-gray-600 body-font relative">
      <div className="container px-5 py-8 mx-auto">
        <div className="flex flex-col text-center w-full mb-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Create User
          </h1>
        </div>
        <div className="lg:w-1/2 md:w-2/3 mx-auto">
          <div className="flex flex-wrap -m-2">
            <div className="p-2 w-1/2">
              <div className="relative">
                <label
                  htmlFor="name"
                  className="leading-7 text-sm text-gray-600"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="p-2 w-1/2">
              <div className="relative">
                <label
                  htmlFor="email"
                  className="leading-7 text-sm text-gray-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="p-2 w-full">
              <button
                type="submit"
                className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </form>
</div>
```

Next lets create state and save the form input data into our state

```js
const [userName, setUserName] = useState("");
const [userEmail, setUserEmail] = useState("");

// And in the input fields add the following code

<input
  type="text"
  id="name"
  name="name"
  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
  value={userName}
  onChange={(e) => setUserName(e.target.value)}
/>

<input
  type="email"
  id="email"
  name="email"
  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
  value={userEmail}
  onChange={(e) => setUserEmail(e.target.value)}
/>
```

Now we already know the default behaviour of form is to refresh the page, so let us create a method which will prevent this from happening.

```js
const handleSubmit = (e) => {
    e.preventDefault();
  };

<form onSubmit={handleSubmit}>
```

Now let us create an async function which will make a request to our backend API for creating a user at http://localhost:8000/createUser.

But before this we need to do one thing which is to add our backend url in `package.json` under proxy

```json
"proxy": "http://localhost:8000"
```

Add the above line anywhere between the {} and make sure to restart your server if it is running already

One last thing we will be using Axios so we need to install it using `npm i axios` and once it is done lets head back to our `Form.js` and import axios at the top

```js
import axios from "axios";

const submitData = async () => {
  try {
    const data = {
      name: userName,
      email: userEmail,
    };

    const res = await axios.post("/createUser", data);
  } catch (error) {
    console.log(error);
  }
};
```

Now finally lets call this function when we submit the form which is handleSubmit()

```js
const handleSubmit = (e) => {
  e.preventDefault();
  submitData();
  // Setting userName and userEmail field to empty after the form is submitted
  setUserName("");
  setUserEmail("");
};
```

Now we are done with the `Form.js` component and our create user should work fine now

Now we need to do the steps to get users, edit users and update users which we will be doing in `UsersList.js`

```js
const UsersList = () => {
  return <h1>Users List</h1>;
};

export default UsersList;
```

Lets first write the structure which will be a table to display the list of all the users.

```js
<section className="text-gray-600 body-font">
  <div className="container px-5 py-24 mx-auto">
    <div className="flex flex-col text-center w-full mb-8">
      <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
        All Users
      </h1>
    </div>
    <div className="lg:w-2/3 w-full mx-auto overflow-auto">
      <table className="table-auto w-full text-left whitespace-no-wrap">
        <thead>
          <tr>
            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
              Name
            </th>
            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
              Email
            </th>
            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
              Edit
            </th>
            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-3">username</td>
            <td className="px-4 py-3">user email</td>
            <td className="px-4 py-3">
              <button className="hover:text-green-500">Edit</button>
            </td>
            <td className="px-4 py-3 text-lg text-gray-900">
              <button className="hover:text-red-500">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
```

Now lets write a function which will make a GET request to our API at http://localhost:8000/getUsers and store the response in a state variable

```js
const [userData, setUserData] = useState(null);

const fetchUsersData = async () => {
  const resp = await axios.get("/getUsers");

  if (resp.data.users.length > 0) {
    setUserData(resp.data.users);
  }
};
```

Now we need to run this function as soon as the page loads and to do that we can use useEffect hook

```js
useEffect(() => {
  fetchUsersData();
}, [userData]);
```

Note: In dependency array we are adding userData, so that the useEffect hook re-renders the UI whenever there is any change

Now to display the users we need to use userData state variable and loop through it to generate the data dynamically

```js
<tbody>
  {userData &&
    userData.map((user) => (
      <tr key={user._id}>
        <td className="px-4 py-3">{user.name}</td>
        <td className="px-4 py-3">{user.email}</td>
        <td className="px-4 py-3">
          <button className="hover:text-green-500">Edit</button>
        </td>
        <td className="px-4 py-3 text-lg text-gray-900">
          <button className="hover:text-red-500">Delete</button>
        </td>
      </tr>
    ))}
</tbody>
```

Now if we have users in our database then they will be displayed on the page load

Now lets make our Edit button work

```js
const handleEdit = async (user) => {
  try {
    const userName = prompt("Enter new name");
    const userEmail = prompt("Enter new email");

    if (!userName || !userEmail) {
      console.log("Please enter both name and email");
    } else {
      const resp = await axios.put(`/editUser/${user._id}`, {
        name: userName,
        email: userEmail,
      });
    }
  } catch (error) {
    console.log(error.response.data.message);
  }
};

// Add onClick in edit button as shown below
<button className="hover:text-green-500" onClick={() => handleEdit(user)}>
  Edit
</button>;
```

With this our edit button should work

Lets do the same with our delete button

```js
const handleDelete = async (userId) => {
  try {
    const resp = await axios.delete(`/deleteUser/${userId}`);

    if (resp.data.success) {
      console.log("User deleted successfully");
    }
  } catch (error) {
    console.log(error.response.data.message);
  }
};

// Add onClick in delete button as shown below

<button className="hover:text-red-500" onClick={() => handleDelete(user._id)}>
  Delete
</button>;
```

With this if all good, our MERN Users CRUD app is done and everything should be working as expected
