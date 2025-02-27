"use client";

import { ChangeEvent, useState } from "react";
import emailjs from "emailjs-com";

interface Person {
  name: string;
  email: string;
  assignedPerson: string;
}

export default function Home() {
  const [people, setPeople] = useState<Person[]>([]);
  const [person, setPerson] = useState<Person>({
    name: "",
    email: "",
    assignedPerson: "",
  });
  const [names, setNames] = useState<string[]>([]);
  const [shuffled, setShuffled] = useState<boolean>(false);
  const [emailed, setEmailed] = useState<boolean>(false);
  const [reveal, setReveal] = useState<boolean>(false);

  function shuffle(names: string[]) {
    for (let i = names.length - 1; i > 0; i--) {
      const randomI = Math.floor(Math.random() * (i + 1));
      [names[i], names[randomI]] = [names[randomI], names[i]];
    }
    return names;
  }
  console.log(names);
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget;

    setPerson((prevPerson) => ({
      ...prevPerson,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (person.name.trim() && person.email.trim()) {
      setPeople((prevPeople) => [...prevPeople, person]);
      setNames((prevNames) => [...prevNames, person.name]);
    }
    setPerson({ name: "", email: "", assignedPerson: "" });
  }

  function handleDelete(deletePerson: Person) {
    const personIndex = people.findIndex(
      (person) =>
        person.name === deletePerson.name && person.email === deletePerson.email
    );

    if (personIndex === -1) {
      throw new Error("Person not found");
    } else {
      setPeople((prevPeople) =>
        prevPeople.filter((_, index) => index !== personIndex)
      );
      setNames((prevNames) =>
        prevNames.filter((name) => name !== deletePerson.name)
      );
    }
  }

  function handleShuffle() {
    if (people.length <= 2) {
      alert("Not enough people to shuffle.");
    }

    if (people.length > names.length) {
      alert("Not enough names to assign to everyone.");
      throw new Error("Not enough names to assign to everyone.");
    }

    if (people.length > 2) {
      let shuffledNames: string[] = shuffle([...names]);

      let shuffleTimes = 0;

      while (shuffledNames.some((name, index) => name === names[index])) {
        shuffledNames = shuffle([...names]);
        shuffleTimes++;
        if (shuffleTimes > 100) {
          alert(
            "Unexpected error: Name assignment failed due to insufficient names."
          );
          throw new Error(
            "Unexpected error: Name assignment failed due to insufficient names."
          );
        }
      }
      const updatedPeople = people.map((person, index) => ({
        ...person,
        assignedPerson: shuffledNames[index],
      }));

      setPeople(updatedPeople);

      alert(
        "Your names have been shuffled! Click email to send them to your friends :)"
      );
      setShuffled(true);
    }
  }

  console.log(people);

  function handleEmail() {
    for (let i = 0; i < people.length; i++) {
      const person = people[i];

      if (!person.assignedPerson) {
        console.error(`No assigned person for ${person.name}`);
        throw new Error(`No assigned person for ${person.name}`);
      }

      const templateParams = {
        to_name: person.name,
        to_email: person.email,
        assigned_person: person.assignedPerson,
      };

      emailjs
        .send(
          "service_vtfflip",
          "template_us943xh",
          templateParams,
          "ZEDYc4ePC7zbIWKLD"
        )
        .then(
          (response) => {
            console.log("Email sent successfully!", response);
            setEmailed(true);
          },
          (error) => {
            console.log("Error sending email:", error);
          }
        );
    }
  }
  console.log(names);

  return (
    <div className="mt-20">
      <div className="flex justify-center">
        <h1 className="font-bold text-5xl text-orange-400">
          Welcome to Name Scrmblr
        </h1>
      </div>
      <div className="flex justify-center mt-4">
        <p className="text-orange-600">Created by Sonia Huynh for fun</p>
      </div>
      <div className="mt-20 flex justify-center">
        <form onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="name" className="mr-2">
            Name:
          </label>
          <input
            className="outline-none border border-purple-300 rounded-md p-2"
            type="text"
            required
            name="name"
            placeholder="Enter name"
            onChange={(e) => handleChange(e)}
            value={person.name}
          />
          <label htmlFor="email" className="ml-8 mr-2">
            Email:
          </label>
          <input
            className="outline-none border border-pink-300 rounded-md p-2"
            type="email"
            required
            name="email"
            placeholder="Enter their email"
            onChange={(e) => handleChange(e)}
            value={person.email}
          />
          <button
            type="submit"
            className="mx-4 p-2 bg-green-500 rounded-full hover:bg-green-600 text-white"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="mt-20 flex justify-center">
        <h1 className="font-bold text-2xl text-purple-500">Your Group:</h1>
      </div>
      <div className="mt-4 flex justify-center  w-full">
        {people.length > 0 && (
          <div className="mt-4 flex justify-center w-full">
            <div className="max-w-xlg border-purple-200 border-2 p-4 rounded-lg">
              {/* <ul className="flex flex-col items-left "> */}
              <ul>
                {people.map((person, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-8 mb-4"
                  >
                    <li>
                      <p>Name: {person.name}</p>
                    </li>
                    <li>
                      <p className="">Email: {person.email}</p>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleDelete(person);
                        }}
                      >
                        delete
                      </button>
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      {!shuffled && (
        <div className="flex justify-center mt-10">
          <button
            className="mx-4 p-2 bg-green-500 rounded-full hover:bg-green-600 text-white "
            onClick={() => handleShuffle()}
          >
            Shuffle
          </button>
        </div>
      )}
      {shuffled && !emailed && (
        <div className="flex justify-center mt-10">
          <button
            className="mx-4 p-2 bg-pink-300 rounded-full hover:bg-pink-500 text-white "
            onClick={() => handleEmail()}
          >
            Email to your friends
          </button>
        </div>
      )}
      {emailed && (
        <>
          <div className="flex justify-center mt-10">
            <p className="mx-4 p-2 text-purple-500">Check your emails!</p>
          </div>
          <div className="flex justify-center mt-10">
            <button
              className="mx-4 p-2 bg-pink-300 rounded-full hover:bg-pink-500 text-white "
              onClick={() => setReveal(true)}
            >
              Reveal assigned names
            </button>
          </div>
        </>
      )}

      {reveal && (
        <div className="mt-8 flex justify-center">
          <div className="max-w-md border-pink-200  border-2 p-4 rounded-lg">
            <ul>
              {people?.map((person, index) => (
                <li key={index} className="flex items-center mb-2">
                  <p>Name: {person.name}</p>
                  <p className="ml-8">
                    Assigned Person: {person.assignedPerson}{" "}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
