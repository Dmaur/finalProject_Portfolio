export interface Project {
    _id:         string;
    projName:    string;
    description: string;
    imgSrc:      string;
    link?:       string;
    tech:        Tech[];
}

export interface Tech {
    techName: string;
}
