import {Injectable} from "@angular/core";
import {Jsonp} from "@angular/http";

@Injectable()

export class LessonService{
    constructor (private jsonp: Jsonp) {}
    
    private lessonUrl = '../data/lessons.json';
}