import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-queueguard-jwt-key-2025';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4)
});

export async function login(req: Request, res: Response) {
  try {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid input credentials format.', details: parse.error.issues });
    }

    const { email, password } = parse.data;
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        assignedCounters: {
          where: { isActive: true },
          include: {
            counter: {
              include: { department: true }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        assignedCounters: user.assignedCounters
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        assignedCounters: {
          where: { isActive: true },
          include: {
            counter: {
              include: { department: true }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      assignedCounters: user.assignedCounters
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch current user' });
  }
}
