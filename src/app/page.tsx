import Link from "next/link";
import { BsMouse } from "react-icons/bs";
import CategoryOne from "./components/categories/category-one";
import PopularListingOne from "./components/popular-listing-one";
import Footer from "./components/footer/footer";
import BackToTop from "./components/back-to-top";
import NavbarServerWrapper from '@/app/components/navbar/navabar-server'
import { generateSEOMetadata } from '../../lib/useSeo';
import FormTwo from "./components/form/form-two";
import ExploreCity from "./components/explore-city";
import HowItsWork from "./components/how-its-work";
import WorkingProcessTwo from "./components/working-process-two";
import { ListingContext } from "./lib/data";

export async function generateMetadata() {
    return await generateSEOMetadata('/');
}

export default function Home() {
    return (
        <>
            <NavbarServerWrapper />

            <div className="image-cover hero-header position-relative" style={{ backgroundImage: `url('/img/banner/ban1.jpg')` }} data-overlay="6">
                <div className="container">
                    <div className="row justify-content-center align-items-center mb-5 pt-lg-0 pt-5">
                        <div className="col-xl-8 col-lg-9 col-md-10 col-sm-12 mx-auto">
                            <div className="position-relative text-center">
                                <h1 className="display-4 fw-bold">Discover Trusted Business Listings In Kenya</h1>
                                <p className="fs-5 fw-light">
                                    Your comprehensive guide to finding contacts, locations, and services from trusted businesses across the nation.
                                </p>
                            </div>
                        </div>
                    </div>
                    <FormTwo />
                </div>
                <div className="mousedrop z-1"><Link href="#mains" className="mousewheel"><BsMouse /></Link></div>
            </div>

            <section className="pb-0" id="mains">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-xl-8 col-lg-9 col-md-11 col-sm-12">
                            <div className="secHeading-wrap text-center mb-5">
                                <h2 className="sectionHeading">Search Listings By Category</h2>
                                <p>From neighborhood entrepreneurs to international suppliers, Kenya Bizz Directory connects you with businesses that serve, support, and trade with Kenya.</p>
                            </div>
                        </div>
                    </div>
                    <CategoryOne />
                </div>
            </section>

            <section>
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
                            <div className="secHeading-wrap text-center">
                                <h3 className="sectionHeading">Trending & Popular <span className="text-primary">Listings</span></h3>
                                <p>Explore Hot & Popular Business Listings</p>
                            </div>
                        </div>
                    </div>
                    <PopularListingOne context={ListingContext.LOCAL} />
                </div>
            </section>
            {/* <section className="bg-light">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
                            <div className="secHeading-wrap text-center">
                                <h3 className="sectionHeading">Our Great <span className="text-primary">Reviews</span></h3>
                                <p>Our cliens love our services and give great & positive reviews</p>
                            </div>
                        </div>
                    </div>
                    <ClientOne />
                </div>
            </section> */}
            <section className="bg-light">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-xl-8 col-lg-9 col-md-11 col-sm-12">
                            <div className="secHeading-wrap text-center">
                                <h2 className="sectionHeading">Explore Top Business Hubs in Kenya</h2>
                                <p>From Nairobi’s vibrant markets to Mombasa’s coastal commerce — discover local businesses across Kenya's most active cities.</p>
                            </div>
                        </div>
                    </div>
                    <ExploreCity />
                </div>
            </section>
            <section className="light-top-gredient">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
                            <div className="secHeading-wrap text-center">
                                <h3 className="sectionHeading">See How It  <span className="text-primary">Works</span></h3>
                                <p>Connecting with trusted businesses across Kenya has never been this easy. Whether you’re searching for local services or want to list your own business, it's simple in just a few steps.</p>
                            </div>
                        </div>
                    </div>
                    <HowItsWork />
                </div>
            </section>
            <WorkingProcessTwo />

            {/* <section>
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
                            <div className="secHeading-wrap text-center">
                                <h3 className="sectionHeading">Latest Updates <span className="text-primary">News</span></h3>
                                <p>Join KenyaBizzDirectory and get latest & trending updates about listing</p>
                            </div>
                        </div>
                    </div>
                    <BlogOne />
                </div>
            </section> */}
            {/* <FooterTop /> */}
            <Footer />
            <BackToTop />
        </>
    );
}