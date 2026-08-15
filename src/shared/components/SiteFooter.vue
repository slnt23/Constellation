<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-header">
        <h3 class="footer-title">Adventure is worthwhile.</h3>
      </div>

      <div class="footer-links">
        <a href="https://space.bilibili.com/1237791199?spm_id_from=333.1007.0.0" class="footer-link">
          <el-icon class="link-icon">
            <VideoCamera />
          </el-icon>
          BiliBili
        </a>
        <a href="https://github.com/" target="_blank" rel="noreferrer" class="footer-link">
          <el-icon class="link-icon">
            <Star />
          </el-icon>
          GitHub
        </a>
        <!-- <a href="https://www.behance.net/" target="_blank" rel="noreferrer" class="footer-link">
          <el-icon class="link-icon"><CoffeeCup /></el-icon>
          占位
        </a> -->
      </div>

      <div class="footer-bottom">
        <span class="footer-info">邮箱：relax271828@petalmail.com</span>
        <span class="footer-divider">|</span>
        <span class="footer-info">设计人：Kite Studio</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { CoffeeCup, Star, VideoCamera } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.site-footer {
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  padding: var(--vercel-section-pad) 0 48px;
  text-align: center;
  background: var(--vercel-ink);
}

.footer-content {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-header {
  margin-bottom: 24px;
}

.footer-title {
  margin: 0;
  color: var(--vercel-on-primary);
  font-family: 'Inter', 'Geist', system-ui, sans-serif;
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.05em;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--vercel-mute);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.02em;
  padding: 6px 10px;
  border-radius: var(--vercel-rounded-sm);
  transition: color 0.15s ease;

  &:hover {
    color: var(--vercel-on-primary);
  }
}

.link-icon {
  font-size: 16px;
}

.footer-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.footer-info {
  font-size: 12px;
  color: var(--vercel-mute);
  line-height: 1.4;
}

.footer-divider {
  color: rgba(255, 255, 255, 0.15);
  font-size: 12px;
}

@media (max-width: 768px) {
  .site-footer {
    padding: 48px 0 32px;
  }

  .footer-content {
    padding: 0 16px;
  }

  .footer-title {
    font-size: 1.4rem;
  }

  .footer-links {
    gap: 20px;
    margin-bottom: 24px;
  }

  .footer-bottom {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .footer-links {
    flex-direction: column;
    gap: 12px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 8px;
  }

  .footer-divider {
    display: none;
  }
}
</style>
