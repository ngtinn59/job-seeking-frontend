import { Carousel } from "antd";
import CustomArrow from "../../../components/CustomArrow";
import Title from "../../../components/Title";
import Wrapper from "../../../components/Wrapper";
import { getFeaturedCompanies } from "../../../services/company/featuredCompany-service";
import { useQuery } from "@tanstack/react-query";
import { FeaturedCompanyType } from "../../../utils/type";
import { useNavigate } from "react-router-dom";

const FeaturedCompanies: React.FC = () => {
  const navigate = useNavigate();
  const { data: featuredCompanies } = useQuery({
    queryKey: ["featuredCompanies"],
    queryFn: () => getFeaturedCompanies(),
    select: (featuredCompaniesData) =>
      featuredCompaniesData.data.featured_companies,
  });

  return (
    <>
      {featuredCompanies && (
        <section>
          <Wrapper>
            <Title type="h2" className="text-center">
              Featured Companies
            </Title>

            <Carousel
              //   autoplay
              effect="scrollx"
              infinite={featuredCompanies && featuredCompanies.length > 5}
              arrows={featuredCompanies && featuredCompanies.length > 5}
              prevArrow={<CustomArrow direction="left" />}
              nextArrow={<CustomArrow direction="right" />}
              dots={featuredCompanies && featuredCompanies.length > 5}
              // appendDots={(dots) => <ul className="custom-slick-dots "> {dots} </ul>}
              autoplaySpeed={5000}
              speed={2000}
              pauseOnHover={true}
              slidesToShow={5}
              className="mx-auto mt-2 rounded-md bg-gray-200 pt-8 shadow-lg transition-all duration-1000 md:w-[90%] lg:max-w-screen-xl"
              responsive={[
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                    arrows: featuredCompanies && featuredCompanies.length > 3,
                    dots: featuredCompanies && featuredCompanies.length > 3,
                  },
                },
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 2,
                    arrows: featuredCompanies && featuredCompanies.length > 2,
                    dots: featuredCompanies && featuredCompanies.length > 2,
                  },
                },
              ]}
            >
              {featuredCompanies &&
                featuredCompanies.map((company: FeaturedCompanyType) => (
                  <div key={company.id} className="pb-8 pt-1">
                    <div
                      className="mx-auto h-[300px] w-[90%] cursor-pointer rounded-xl bg-white shadow-[0px_0px_5px_1px_rgba(0,0,0,0.24)] transition-all duration-1000"
                      onClick={() =>
                        navigate(
                          `/company/${company.company_name.replace(/ /g, "-")}` +
                            `-${company.id}`,
                        )
                      }
                    >
                      <div className="flex h-[60%] items-center justify-center overflow-hidden rounded-t-xl shadow-md">
                        <img
                          src={company.logo}
                          alt={company.company_name}
                          className="object-cover transition-transform duration-1000 hover:scale-125"
                        />
                      </div>

                      <div className="flex h-[40%] items-center justify-center text-balance p-2 text-center text-black">
                        <Title type="h4">{company.company_name}</Title>
                      </div>
                    </div>
                  </div>
                ))}
            </Carousel>
          </Wrapper>
        </section>
      )}
    </>
  );
};

export default FeaturedCompanies;
