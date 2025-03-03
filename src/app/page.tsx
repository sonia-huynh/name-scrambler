"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify/unstyled";
import { Bounce } from "react-toastify";

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
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget;

    setPerson((prevPerson) => ({
      ...prevPerson,
      [name]: value,
    }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
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
    const noShuffle = () =>
      toast.error("You must have at least 3 people to shuffle!");

    const notEnoughNames = () =>
      toast.error("Not enough names to assign to everyone.");

    const overShuffled = () =>
      toast.error(
        "Unexpected error: Name assignment failed due to insufficient names."
      );

    const shuffled = () =>
      toast.success(
        "Your names have been shuffled! Click email to send them to your friends :)"
      );

    if (people.length <= 2) {
      noShuffle();
    }

    if (people.length > names.length) {
      notEnoughNames();
      throw new Error("Not enough names to assign to everyone.");
    }

    if (people.length > 2) {
      let shuffledNames: string[] = shuffle([...names]);

      let shuffleTimes = 0;

      while (shuffledNames.some((name, index) => name === names[index])) {
        shuffledNames = shuffle([...names]);
        shuffleTimes++;
        if (shuffleTimes > 100) {
          overShuffled();
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

      shuffled();
      setShuffled(true);
    }
  }

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

  return (
    <div className="app-border">
      <div className="flex justify-center">
        <h1 className="font-bold text-5xl text-[color:--primary] max-sm:text-xlg text-center">
          Welcome to Name Scrmblr
        </h1>
      </div>
      <div className="flex justify-center mt-4">
        <p className="text-xl text-[color:--accent] max-sm:text-lg text-center">
          Created by Sonia Huynh for fun
        </p>
      </div>
      <div className="flex justify-center mt-2">
        <Image
          src="/favicon.ico"
          width={200}
          height={20}
          alt="blender to symbolise scrambling names"
          className="max-md:w-40 max-sm:w-30"
        />
      </div>
      <div className="mt-16 max-sm:text-xlg max-lg:text-center max-lg:mt-6">
        <form onSubmit={(e) => handleSubmit(e)}>
          <label
            htmlFor="name"
            className="mr-2 input-mobile-size max-lg:block max max-lg:mr-0"
          >
            Name:
          </label>
          <input
            className="outline-none border border-[color:--secondary] rounded-md p-2 max-w-[250px] input-size-small-screen "
            type="text"
            required
            name="name"
            placeholder="Enter name"
            onChange={(e) => handleChange(e)}
            value={person.name}
          />
          <label
            htmlFor="email"
            className="ml-8 mr-2 input-mobile-size max-lg:block max-lg:mt-4 max-lg:ml-0"
          >
            Email:
          </label>
          <input
            className="outline-none border border-[color:--secondary] rounded-md p-2 max-w-[360px] input-size-small-screen "
            type="email"
            required
            name="email"
            placeholder="Enter their email"
            onChange={(e) => handleChange(e)}
            value={person.email}
          />
          <button
            type="submit"
            className="mx-4 p-2 bg-[--accent] rounded-full hover:bg-[color:--secondary] text-white submit-mobile-screen"
          >
            Submit
          </button>
        </form>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      <div className="mt-20 flex justify-center">
        <h1 className="font-bold text-2xl text-[color:--primary]">
          Your Group:
        </h1>
      </div>
      <div className="mt-2 flex justify-center w-full ">
        {people.length > 0 && (
          <div className="flex justify-center w-full">
            <div className="p-4 ">
              <ul>
                {people.map((person, index) => (
                  <div
                    key={index}
                    className="flex justify-between gap-8 mb-4  input-small-screen"
                  >
                    <li className="flex gap-2">
                      <p className="text-[--accent]">Name:</p>
                      <p>{person.name}</p>
                    </li>
                    <li className="flex gap-2">
                      <p className="text-[--accent]">Email:</p>
                      <p>{person.email}</p>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleDelete(person);
                        }}
                        className={shuffled ? "hidden" : "text-red-600 flex"}
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
            className={
              shuffled
                ? "hidden"
                : "mx-4 p-2 bg-[--accent] rounded-full hover:bg-[--secondary] text-white"
            }
            onClick={() => handleShuffle()}
          >
            Shuffle
          </button>
        </div>
      )}
      {shuffled && !emailed && (
        <div className="flex justify-center mt-10">
          <button
            className="mx-4 p-2 bg-[--accent] rounded-full hover:bg-pink-500 text-white "
            onClick={() => handleEmail()}
          >
            Email to your friends
          </button>
        </div>
      )}
      {emailed && (
        <>
          <div className="flex justify-center mt-6">
            <p className="mx-4 p-2 text-[--primary] font-bold ">
              Check your emails!
            </p>
          </div>
          <div className={reveal ? "hidden" : "flex justify-center mt-10"}>
            <button
              className={
                reveal
                  ? "hidden"
                  : "mx-4 p-2 bg-[--accent] rounded-full hover:bg-[--secondary] text-white"
              }
              onClick={() => setReveal(true)}
            >
              Reveal assigned names
            </button>
          </div>
        </>
      )}

      {reveal && (
        <div className="mt-8 flex justify-center">
          <div className="p-4 ">
            <ul>
              {people?.map((person, index) => (
                <div
                  key={index}
                  className="flex justify-between gap-8 mb-4 input-small-screen"
                >
                  <li className="flex gap-2">
                    <p className="text-[--accent]">Name: </p>
                    <p>{person.name}</p>
                  </li>
                  <li className="flex gap-2">
                    <p className="text-[--accent]">Assigned Person:</p>
                    <p>{person.assignedPerson}</p>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
