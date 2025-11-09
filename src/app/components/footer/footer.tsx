import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { FaLinkedinIn } from 'react-icons/fa6';
import { BsEnvelope, BsClock } from 'react-icons/bs';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

import { footerLink1, footerLink2, footerLink3 } from '../../data/data';

export default function Footer() {
    return (
        <footer className="footer skin-dark-footer">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-md-5 col-lg-12 col-xl-4">
                        <div className="footer-widget pe-xl-4 mb-5">
                            {/* Logo Updated */}
                            <div className="footerLogo">
                                <Image src='/img/logo/kbd-white.png' width={120} height={0} alt="Footer Logo" style={{ objectFit: 'contain', height: 'auto' }} />
                            </div>
                            {/* Copyright Text Updated */}
                            <div className="footerText">
                                <p>Kenya Bizz is proudly managed by <Link href="https://visionarybizz.com/" target="_blank" className="text-light">Visionary Services</Link></p>
                            </div>
                            {/* Social Links Updated */}
                            <div className="footerSocialwrap">
                                <ul className="footersocial">
                                    <li><Link href="https://www.facebook.com/profile.php?id=61579269054692" target="_blank" className="social-link"><FaFacebookF /></Link></li>
                                    <li><Link href="https://www.instagram.com/kenyabizzdirectory/" target="_blank" className="social-link"><FaInstagram /></Link></li>
                                    <li><Link href="https://www.linkedin.com/company/108607908/" target="_blank" className="social-link"><FaLinkedinIn /></Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md-4 offset-md-3 col-lg-3 offset-lg-0 col-xl-2">
                        <div className="footer-widget mb-5 mb-md-5 mb-lg-0">
                            <h4 className="widget-title text-pri">Explore</h4>
                            <ul className="footer-menu">
                                {footerLink1.map((item, index) => (
                                    <li key={index}><Link href={item.href}>{item.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                        <div className="footer-widget mb-5 mb-md-5 mb-lg-0">
                            <h4 className="widget-title">Categories</h4>
                            <ul className="footer-menu">
                                {footerLink2.map((item, index) => (
                                    <li key={index}><Link href={item.href}>{item.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                        <div className="footer-widget">
                            <h4 className="widget-title">Legal</h4>
                            <ul className="footer-menu">
                                {footerLink3.map((item, index) => (
                                    <li key={index}><Link href={item.href}>{item.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                        <div className="footer-widget">
                            <h4 className="widget-title">Get In Touch</h4>
                            <div className="contactInfowrap">

                                {/* Replaced 'align-items-center' with 'align-items-baseline' */}
                                <div className="singleinfo d-flex align-items-baseline">
                                    <div className="icons">
                                        <span className="badge badge-primary rounded-circle p-2">
                                            <BsEnvelope className="fs-5" />
                                        </span>
                                    </div>
                                    <div className="caps">
                                        <h5 className="title text-light">
                                            <a href="mailto:info@kenyabizzdirectory.com" className="text-light">info@kenyabizzdirectory.com</a>
                                        </h5>
                                        <p className="subs text-muted">Email Us</p>
                                    </div>
                                </div>

                                {/* Replaced 'align-items-center' with 'align-items-baseline' */}
                                <div className="singleinfo d-flex align-items-baseline">
                                    <div className="icons">
                                        <span className="badge badge-primary rounded-circle p-2">
                                            <BsClock className="fs-5" />
                                        </span>
                                    </div>
                                    <div className="caps">
                                        <h5 className="title text-light">9 am to 6 pm</h5>
                                        <p className="subs text-muted">Mon - Sat</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}