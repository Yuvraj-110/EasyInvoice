//src /pages/SelectTemplate/jsx

import { useParams, useNavigate } from "react-router-dom";

export default function SelectTemplate() {
  const { businessId } = useParams();
  const navigate = useNavigate();

  const templates = [
    {
      name: "Classic",
      key: "classic",
      description: "Traditional professional look.",
      image: "/invoices/ClassicInvoice.png", // adjust path
    },
    {
      name: "Minimal",
      key: "minimal",
      description: "Clean & modern minimalist.",
      image: "/invoices/MinimalInvoice.png",
    },
    {
      name: "Elegant",
      key: "elegant",
      description: "Soft colors & neat layout.",
      image: "/invoices/ElegantInvoice.png",
    }
    // {
    //   name: "Bold",
    //   key: "bold",
    //   description: "Strong headings & highlights.",
    //   image: "/invoices/invoice (2).jpg",
    // },
    // {
    //   name: "Corporate",
    //   key: "corporate",
    //   description: "Formal corporate style.",
    //   image: "/invoices/invoice (3).jpg",
    // },
    // {
    //   name: "Creative",
    //   key: "creative",
    //   description: "Stylish and unique design.",
    //   image: "/invoices/invoice (4).jpg",
    // },
  ];

  const selectTemplate = (key) => {
    navigate(`/business/${businessId}/create-invoice?template=${key}`);
  };

  return (
    <div className="mt-9 max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Select Invoice Template
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((tpl) => (
          <div
            key={tpl.key}
            onClick={() => selectTemplate(tpl.key)}
            className="relative cursor-pointer rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 group"
          >
            <img
              src={tpl.image}
              alt={tpl.name}
              className="w-full h-60 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center text-center text-white p-4">
              <h2 className="text-xl font-bold mb-2">{tpl.name}</h2>
              <p className="text-sm">{tpl.description}</p>
              <button className="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg shadow">
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
