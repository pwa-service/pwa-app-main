import { data } from "../constants/template";

import Description from "../components/google/Description";
import ImageSlider from "../components/google/ImageSlider";

const Google = () => {
  return (
    <main className="max-w-screen-xl w-full mx-auto p-6 sm:p-10">
      <Description imageSRC={data.productImage} productName={data.productName} />
      <ImageSlider images={data.images} handleSelectImage={() => {}} />

      <section className="pt-5 space-y-5">
        <h3 className="text-xl font-medium">About this up</h3>

        {data.description.map((row, index) => (
          <p key={index}>{row}</p>
        ))}

        <div>TAGS</div>
      </section>

      <section className="pt-5">
        <h3 className="text-xl font-medium">Data safety</h3>

        <p className="mt-5">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text ever since the 1500s
        </p>

        <div className="h-[300px] mt-5 p-4 border rounded-lg">CONTENT</div>
      </section>

      <section className="pt-5">
        <h3 className="text-xl font-medium">Rating and reviews</h3>

        <div>
          <div>TAGS</div>
          <div>RATING</div>
        </div>
      </section>

      <section className="pt-5">
        <div>COMMENT</div>
      </section>
    </main>
  );
};

export default Google;
