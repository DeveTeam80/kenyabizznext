'use client';

import React from 'react';
import { workData } from '../data/data';
import { IconType } from 'react-icons';

interface WorkData {
    icon: IconType;
    title: string;
    desc: string;
}

export default function HowItsWork() {
    return (
        // The class 'align-items-center' has been removed from this line
        <div className="row justify-content-center g-4">
            {workData.map((item: WorkData, index: number) => {
                let Icon = item.icon;
                return (
                    <div className="col-xl-3 col-lg-3 col-md-6" key={index}>
                        <div className="card rounded-3 shadow-sm h-100">
                            <div className="card-body p-lg-5 p-4">
                                <div className="featuresIcons">
                                    <div className="d-flex align-items-center justify-content-center mb-4">
                                        <span className="square--90 circle badge-primary"><Icon className="fs-2" /></span>
                                    </div>
                                </div>
                                <div className="featuresCaption text-center mb-3">
                                    <h5 className="fw-semibold mb-3">{item.title}</h5>
                                    <p className="fs-6 fw-light m-0">{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}