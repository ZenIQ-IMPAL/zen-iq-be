import type { Testimonial } from '../../../database/schema';

export interface TestimonialsFilters {
    isFeatured?: boolean;
    page: number;
    limit: number;
}

export interface TestimonialWithUser extends Testimonial {
    user: {
        id: string;
        fullName: string;
        email: string;
    };
}

export interface TestimonialsListResponse {
    testimonials: TestimonialWithUser[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
