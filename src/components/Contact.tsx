"use client";

import { useState, useRef, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import React from "react";

interface AboutProps {
    isLarge: boolean;
    setSiteState: (index: number) => void;
}

export default function Contact({ isLarge, setSiteState }: AboutProps) {
    const [userName, setUserName] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    const [messageCont, setMessageCont] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [isAlertVisible, setIsAlertVisible] = React.useState(false);

    const form = useRef<HTMLFormElement | null>(null);
    const publicKey: string = "z0BimyDiKPSxpy1dC";
    const serviceId: string = "service_he1wspt";
    const templateId: string = "template_bbvcl8u";

    const validName = (str: string) => /^[A-Za-z]+(?:[-' ][A-Za-z]+)*$/.test(str);
    const validEmail = (str: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str);
    const msgValid = (str: string) => /^[\w\s.,!?@#$%^&*()\-_=+[\]{};:'"<>/|\\~`]*$/.test(str);

    const isNameValid = userName.trim().length > 0
        && userName.length <= 30
        && validName(userName);
    const isEmailValid = userEmail.trim().length > 0
        && userEmail.length <= 100
        && validEmail(userEmail);
    const isMsgValid = messageCont.trim().length > 0
        && messageCont.length <= 1500
        && msgValid(messageCont);

    const submitEnabled = isEmailValid && isNameValid && isMsgValid;

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (form.current) {
            emailjs
                .sendForm(serviceId, templateId, form.current, publicKey)
                .then(() => {
                    setStatus("Message sent!");
                    setUserName("");
                    setUserEmail("");
                    setMessageCont("");
                    if (form.current) {
                        form.current.reset();
                    }
                    setIsAlertVisible(true);
                    setTimeout(() => {
                        setIsAlertVisible(false);
                    }, 3000);
                })
                .catch((err) => {
                    setStatus("Failed to send the message. Please try again.");
                    console.error("EmailJS error:", err);
                });
        }

    };

    return (
        <div className="m-2 p-4 h-[50vh] flex flex-col bg-glaucous-200 text-ash_gray-800 rounded-md shadow-md shadow-ash_gray-200 overflow-y-auto">


            <div className="relative flex flex-row justify-center items-center">

                <button
                    onClick={() => setSiteState(0)}
                    className="absolute font-medium top-0 right-0 mr-2 text-s text-white hover:bg-gray-100 hover:text-black hover:text-opacity-100 hover:rounded-full hover:opacity-25 p-3">
                    X
                </button>
            </div>
            <h1 className="mb-5 mt-10 text-xl  lg:text-4xl font-bold text-center">
                Say Hi! <span className="text-5xl">&#128075;</span>
            </h1>

            <div className="flex flex-col self-center">
                <form
                    ref={form}
                    onSubmit={handleSubmit}
                    className="flex flex-col lg:flex-row w-[63vw]">

                    <div className="m-5 flex flex-col self-center lg:flex-none lg:self-baseline ">
                        <label htmlFor="name" className="mb-2 lg:w-[25vw]">
                            Name: <span className={`${isNameValid ? "hidden" : "text-yellow-500"}`}> Aa-Zz</span>
                        </label>
                        <input
                            onChange={(e) => setUserName(e.target.value)}
                            className={`rounded mb-4 text-black w-[50vw] focus:outline-none focus:ring-2 lg:w-[20vw] h-10  p-2 ${isNameValid ? "focus:ring-green-700" : "focus:ring-rose-700"}`}
                            type="text"
                            id="name"
                            name="name"
                            maxLength={30}
                            placeholder="Jon Doe..."
                            required
                        />
                        <label htmlFor="email" className="mb-2 lg:w-[25vw]">
                            Email: <span className={`${isEmailValid ? "hidden" : "text-yellow-500"}`}>Enter valid email</span>
                        </label>
                        <input
                            onChange={(e) => setUserEmail(e.target.value)}
                            className={`rounded mb-6 text-black w-[50vw] focus:outline-none focus:ring-2 lg:w-[20vw] h-10 p-2 ${isEmailValid ? "focus:ring-green-700" : "focus:ring-rose-700"}`}
                            type="email"
                            id="email"
                            name="email"
                            maxLength={100}
                            placeholder="YourEmail@example.com..."
                            required
                        />

                    </div>
                    <div className="flex flex-col lg:mt-4 ">

                        <label htmlFor="message" className="self-center w-[50vw] lg:w-[35vw]">
                            Message: <span className={`${isMsgValid ? "hidden" : "text-yellow-500"}`}>Enter a message</span>
                        </label>
                        <textarea
                            onChange={(e) => setMessageCont(e.target.value)}
                            className={`rounded mb-3 mt-3 self-center text-black w-[50vw] focus:outline-none focus:ring-2 lg:w-[35vw] lg:mb-6 h-32 p-2 ${isMsgValid ? "focus:ring-green-700" : "focus:ring-rose-700"}`}
                            name="message"
                            id="message"
                            placeholder="What's on your mind?"
                            maxLength={1500}
                            required
                        ></textarea>

                        <div className="flex flex-col justify-items-center lg:justify-between lg:flex-row">

                            <button
                                type="submit"
                                className={`w-40 mt-2 lg:mt-0 self-center bg-yellow-600 py-3 rounded ${submitEnabled ? "hover:bg-yellow-600" : "opacity-50 cursor-not-allowed"}  `}
                            >
                                SEND
                            </button>
                            <span className={`self-center text-center mt-2 lg:mt-4 text-lg ${submitEnabled ? "hidden" : "text-yellow-600"}`}>Not all fields are valid</span>




                        </div>
                        {status && isAlertVisible && <p className="self-center lg:mt-4 text-lg">{status}</p>}


                    </div>




                </form>

            </div>



        </div>
    );
}
