import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async create(email: string, password: string): Promise<User> {
        const existing = await this.userRepo.findOneBy({ email });
        if (existing) throw new ConflictException('Email already registered');
        // bcrypt cost factor 12 — a good balance of security vs CPU time
        const passwordHash = await bcrypt.hash(password, 12);
        const user = this.userRepo.create({ email, passwordHash });
        return this.userRepo.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepo.findOneBy({ email });
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepo.findOneBy({ id });
    }
}