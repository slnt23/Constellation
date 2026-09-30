<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-header">
        <h3 class="footer-title">Adventure is worthwhile.</h3>
      </div>

      <div class="footer-links">
        <a href="https://space.bilibili.com/1237791199?spm_id_from=333.1007.0.0" class="footer-link" target="_blank"
          rel="noreferrer">
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
      </div>

      <div class="footer-divider-line" />

      <div class="footer-bottom">
        <span class="footer-info">邮箱：relax271828@petalmail.com</span>
        <span class="footer-info">设计人：Kite Studio</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Star, VideoCamera } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.site-footer {
  --footer-ink: #0a0a0a;
  --footer-on-primary: #ffffff;
  --footer-muted: #888888;
  --footer-section-pad: 64px;

  position: relative;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  padding: var(--footer-section-pad) 0 48px;
  text-align: center;
  background: var(--footer-ink);
  overflow: hidden;
}

.site-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 800px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12) 50%, transparent);
}

.footer-content {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-header {
  margin-bottom: 32px;
}

.footer-title {
  margin: 0;
  color: var(--footer-on-primary);
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
  gap: 16px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--footer-muted);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.02em;
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    color: var(--footer-on-primary);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.link-icon {
  font-size: 16px;
}

.footer-divider-line {
  width: 60%;
  max-width: 400px;
  height: 1px;
  margin: 0 auto 32px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08) 50%, transparent);
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.footer-info {
  font-size: 12px;
  color: var(--footer-muted);
  line-height: 1.4;
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
    gap: 12px;
    margin-bottom: 32px;
  }

  .footer-link {
    padding: 6px 14px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .footer-links {
    flex-direction: column;
    gap: 10px;
  }

  .footer-divider-line {
    width: 50%;
  }
}
</style>