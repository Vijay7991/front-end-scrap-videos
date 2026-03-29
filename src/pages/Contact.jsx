import { useState } from "react";
import { sendContactMessage } from "../api/api";
import { toast } from "react-toastify";

function Contact() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await sendContactMessage(form);

            toast.success(res.data.message || "Message sent successfully");

            setForm({
                name: "",
                email: "",
                message: ""
            });

        } catch (error) {

            toast.error("Failed to send message");

        }

    };

    return (

        <div className="container py-5">

            <h2 className="fw-bold mb-4">Contact Us</h2>

            <div className="row">

                <div className="col-md-6">

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label className="form-label">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Your Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Message</label>
                            <textarea
                                name="message"
                                className="form-control"
                                rows="4"
                                value={form.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button className="btn btn-primary">
                            Send Message
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default Contact;