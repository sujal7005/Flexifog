import { Link } from "react-router-dom";

// Checkpoints Data
const checkpoints = [
  {
    title: "Hardware Inspection",
    description:
      "We inspect every hardware component to ensure it meets industry standards and is free of defects. This includes checking the motherboard, CPU, GPU, RAM, storage, and power supply for any potential issues.",
    image: "/images/hardware-inspection.jpg",
  },
  {
    title: "Software & OS Check",
    description:
      "All necessary drivers, operating system updates, and essential software are pre-installed and tested for stability, ensuring a seamless user experience right out of the box.",
    image: "/images/software-check.jpg",
  },
  {
    title: "Performance Benchmarking",
    description:
      "We run a series of benchmark tests to measure system performance, stress-test the CPU and GPU, and ensure that the system operates at peak efficiency.",
    image: "/images/performance-benchmark.jpg",
  },
  {
    title: "Cooling System Analysis",
    description:
      "Proper cooling is essential for long-term performance. We analyze the airflow, test fan speeds, and measure CPU/GPU temperatures under load to prevent overheating.",
    image: "/images/cooling-system.jpg",
  },
  {
    title: "Storage & Memory Testing",
    description:
      "We check the read/write speeds of storage drives and conduct RAM stability tests to ensure fast, error-free operation under various workloads.",
    image: "/images/storage-memory.jpg",
  },
  {
    title: "Connectivity & Ports Check",
    description:
      "Every USB port, HDMI, Ethernet, Bluetooth, and Wi-Fi module is tested for functionality, ensuring seamless connectivity.",
    image: "/images/connectivity-ports.jpg",
  },
  {
    title: "Final Quality Assurance",
    description:
      "Before shipping, we perform a final round of checks, ensuring all components function perfectly and the system meets our high-quality standards.",
    image: "/images/quality-assurance.jpg",
  },
];

const HubComputerDetails = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-6">
      {/* Content Box */}
      <div className="bg-white shadow-lg rounded-lg w-full max-w-5xl p-6 md:p-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-700">Why Choose 7HubComputer?</h1>
        </div>

        <div className="mt-12 space-y-12">
          {checkpoints.map((checkpoint, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-6 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Text Section */}
              <div className="md:w-1/2 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900">
                  {checkpoint.title}
                </h2>
                <p className="mt-2 text-lg text-gray-700">{checkpoint.description}</p>
              </div>

              {/* Image Section */}
              <div className="md:w-1/2 flex justify-center">
                <img
                  src={checkpoint.image}
                  alt={checkpoint.title}
                  className="w-full md:w-96 h-56 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HubComputerDetails;