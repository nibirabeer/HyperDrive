import { useParams } from "react-router-dom";

const carData = {
  1: { name: "Lamborghini Aventador", price: "£1500", image: "/images/lamborghini.jpg" },
  2: { name: "Ferrari LaFerrari", price: "£1800", image: "/images/ferrari.jpg" },
  3: { name: "Bugatti Chiron", price: "£2500", image: "/images/bugatti.jpg" },
};

const CarDetails = () => {
  const { id } = useParams();
  const car = carData[id];

  if (!car) {
    return <div className="text-center text-red-500 text-xl">Car not found!</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{car.name}</h1>
      <img src={car.image} alt={car.name} className="w-full max-w-lg mx-auto my-4" />
      <p className="text-xl text-gray-600">Price per day: {car.price}</p>
      <BookingForm car={car} />
    </div>
  );
};

export default CarDetails;
