import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubjectModel } from './models/create-subject.model';

@Injectable()
export class SubjectService {
  constructor(@InjectRepository(Subject) private subjectRepository: Repository<Subject>) {}

  async findOne(id: number): Promise<Subject | undefined> {
    return this.subjectRepository.findOneBy({ id });
  }
  async findOneByName(name: string): Promise<Subject | undefined> {
    return this.subjectRepository.findOneBy({ name });
  }
  async findAll(): Promise<Subject[]> {
    return this.subjectRepository.find();
  }
  async createSubject(subject: CreateSubjectModel): Promise<Subject> {
    return this.subjectRepository.save(subject);
  }
  async updateSubject(id: number, subject: CreateSubjectModel) {
    return this.subjectRepository.update(id, subject);
  }
  async deleteSubject(id: number) {
    return this.subjectRepository.delete(id);
  }
}
