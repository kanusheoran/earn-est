import { Router } from 'express';
import { login, getCurrentUser } from '../controllers/authController.js';
import { 
  getDepartments, 
  getDepartmentQueueStatus, 
  joinQueue, 
  getQueueByToken, 
  cancelQueueEntry 
} from '../controllers/queueController.js';
import { 
  getStaffQueue, 
  callNext, 
  startService, 
  completeService, 
  skipCustomer, 
  recallCustomer, 
  toggleCounterPause 
} from '../controllers/staffController.js';
import { 
  getAnalytics, 
  createDepartment, 
  updateDepartment, 
  getCounters, 
  createCounter, 
  updateCounter, 
  getStaffList, 
  createStaff, 
  assignStaffToCounter 
} from '../controllers/adminController.js';
import { getLiveDisplayData } from '../controllers/displayController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// 1. Auth routes
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getCurrentUser);

// 2. Public / Customer Queue routes
router.get('/departments', getDepartments);
router.get('/departments/:id/queue-status', getDepartmentQueueStatus);
router.post('/queues/join', joinQueue);
router.get('/queues/:token', getQueueByToken);
router.post('/queues/:id/cancel', cancelQueueEntry);

// 3. Live Reception/TV Display routes
router.get('/display', getLiveDisplayData);

// 4. Staff Queue Operations (Protected: STAFF or ADMIN)
router.get('/staff/queue', authenticateToken, requireRole(['STAFF', 'ADMIN']), getStaffQueue);
router.post('/staff/queue/call-next', authenticateToken, requireRole(['STAFF', 'ADMIN']), callNext);
router.post('/staff/queue/:id/start', authenticateToken, requireRole(['STAFF', 'ADMIN']), startService);
router.post('/staff/queue/:id/complete', authenticateToken, requireRole(['STAFF', 'ADMIN']), completeService);
router.post('/staff/queue/:id/skip', authenticateToken, requireRole(['STAFF', 'ADMIN']), skipCustomer);
router.post('/staff/queue/:id/recall', authenticateToken, requireRole(['STAFF', 'ADMIN']), recallCustomer);
router.post('/staff/counters/:counterId/toggle-pause', authenticateToken, requireRole(['STAFF', 'ADMIN']), toggleCounterPause);

// 5. Admin Endpoints (Protected: ADMIN only)
router.get('/admin/analytics', authenticateToken, requireRole(['ADMIN']), getAnalytics);

// Department management
router.post('/admin/departments', authenticateToken, requireRole(['ADMIN']), createDepartment);
router.put('/admin/departments/:id', authenticateToken, requireRole(['ADMIN']), updateDepartment);

// Counter management
router.get('/admin/counters', authenticateToken, requireRole(['ADMIN']), getCounters);
router.post('/admin/counters', authenticateToken, requireRole(['ADMIN']), createCounter);
router.put('/admin/counters/:id', authenticateToken, requireRole(['ADMIN']), updateCounter);

// Staff management
router.get('/admin/staff', authenticateToken, requireRole(['ADMIN']), getStaffList);
router.post('/admin/staff', authenticateToken, requireRole(['ADMIN']), createStaff);
router.post('/admin/staff/assign-counter', authenticateToken, requireRole(['ADMIN']), assignStaffToCounter);

export default router;
