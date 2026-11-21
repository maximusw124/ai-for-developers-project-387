import { expect, test } from "@playwright/test";

const MEETING_TYPE = "Сквозная встреча";
const GUEST_NAME = "Мария";
const GUEST_EMAIL = "maria@example.com";
const TOPIC_MEETING_TYPE = "Встреча с темой E2E";
const NO_TOPIC_MEETING_TYPE = "Обычная встреча E2E";
const TOPIC_TEXT = "Обсудить архитектуру и сроки";

test("owner creates a meeting type, guest books it, owner sees the booking", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { level: 1, name: "Админка" }),
  ).toBeVisible();

  const types = page.getByRole("region", { name: "Типы встреч" });
  await types.getByLabel("Название").fill(MEETING_TYPE);
  await types.getByLabel("Описание").fill("Разбор задачи вместе с владельцем");
  await types.getByLabel("Длительность (мин)").fill("30");
  await types.getByRole("button", { name: "Сохранить" }).click();

  const createdType = types.locator(".admin-type-item").filter({
    hasText: MEETING_TYPE,
  });
  await expect(createdType).toBeVisible();

  await page.goto("/book");
  await expect(
    page.getByRole("heading", { level: 1, name: "Запись на встречу" }),
  ).toBeVisible();
  await page.getByRole("link", { name: MEETING_TYPE }).click();

  await expect(
    page.getByRole("heading", { level: 2, name: MEETING_TYPE }),
  ).toBeVisible();
  await expect(
    page.getByText("Все время указано по Москве (Europe/Moscow)."),
  ).toBeVisible();

  const dates = page.getByRole("group", { name: "Даты записи" });
  await expect(dates.getByRole("button")).toHaveCount(14);
  await dates
    .getByRole("button", { name: /понедельник, 16 ноября 2026/ })
    .click();
  await page.getByRole("button", { name: /10:00–10:30/ }).click();
  await expect(page.getByRole("status")).toContainText(
    "Выбран слот: 10:00–10:30",
  );

  await page.getByLabel("Имя").fill(GUEST_NAME);
  await page.getByLabel("Email").fill(GUEST_EMAIL);
  await page
    .getByLabel("Комментарий (необязательно)")
    .fill("Обсудим архитектуру");
  await page.getByRole("button", { name: "Подтвердить запись" }).click();

  const confirmation = page.locator(".booking-confirmation");
  await expect(
    confirmation.getByRole("heading", { name: "Встреча забронирована" }),
  ).toBeVisible();
  await expect(confirmation).toContainText(MEETING_TYPE);
  await expect(confirmation).toContainText("30 мин");
  await expect(confirmation).toContainText("Время по Москве");
  await expect(confirmation).toContainText("10:00–10:30");
  await expect(confirmation).toContainText("Владелец");
  await expect(confirmation).toContainText(GUEST_NAME);
  await expect(confirmation).toContainText(GUEST_EMAIL);
  await expect(
    confirmation.getByText(
      "Письмо с подтверждением не отправляется — сохраните данные этой страницы.",
    ),
  ).toBeVisible();

  await page.goto("/admin");
  const upcoming = page.getByRole("region", { name: "Предстоящие встречи" });
  await expect(upcoming.getByText("Время по Москве")).toBeVisible();
  await upcoming.getByRole("button", { name: "Обновить" }).click();

  const booking = upcoming.locator(".booking-card").filter({
    hasText: MEETING_TYPE,
  });
  await expect(booking).toBeVisible();
  await expect(booking).toContainText("10:00–10:30");
  await expect(booking).toContainText(GUEST_NAME);
  await expect(booking).toContainText("Обсудим архитектуру");
  await expect(
    booking.getByRole("link", { name: GUEST_EMAIL }),
  ).toHaveAttribute("href", `mailto:${GUEST_EMAIL}`);
});

test("guest books with a talk topic and owner sees it in the card heading", async ({
  page,
}) => {
  await page.goto("/admin");
  const types = page.getByRole("region", { name: "Типы встреч" });
  await types.getByLabel("Название").fill(TOPIC_MEETING_TYPE);
  await types.getByLabel("Описание").fill("Разбор задачи вместе с владельцем");
  await types.getByLabel("Длительность (мин)").fill("30");
  await types.getByRole("button", { name: "Сохранить" }).click();
  await expect(
    types.locator(".admin-type-item").filter({ hasText: TOPIC_MEETING_TYPE }),
  ).toBeVisible();

  await page.goto("/book");
  await page.getByRole("link", { name: TOPIC_MEETING_TYPE }).click();
  await page
    .getByRole("group", { name: "Даты записи" })
    .getByRole("button", { name: /понедельник, 16 ноября 2026/ })
    .click();
  await page.getByRole("button", { name: /11:00–11:30/ }).click();
  await page.getByLabel("Имя").fill("Ольга");
  await page.getByLabel("Email").fill("olga@example.com");
  await page.getByLabel("Тема разговора (необязательно)").fill(TOPIC_TEXT);
  await page
    .getByLabel("Комментарий (необязательно)")
    .fill("Детали в комментарии");
  await page.getByRole("button", { name: "Подтвердить запись" }).click();
  await expect(
    page
      .locator(".booking-confirmation")
      .getByRole("heading", { name: "Встреча забронирована" }),
  ).toBeVisible();

  await page.goto("/admin");
  const upcoming = page.getByRole("region", { name: "Предстоящие встречи" });
  await upcoming.getByRole("button", { name: "Обновить" }).click();
  const booking = upcoming
    .locator(".booking-card")
    .filter({ hasText: TOPIC_MEETING_TYPE });
  await expect(booking).toBeVisible();

  const heading = booking.locator(".booking-card__heading");
  await expect(heading.locator(".booking-card__topic")).toHaveText(TOPIC_TEXT);
  await expect(heading).toContainText("11:00–11:30");
  await expect(booking).toContainText("Ольга");
  const details = booking.locator(".booking-card__details");
  await expect(details).not.toContainText(TOPIC_TEXT);
  await expect(details).toContainText("Детали в комментарии");
  await expect(
    details.getByRole("link", { name: "olga@example.com" }),
  ).toHaveAttribute("href", "mailto:olga@example.com");
});

test("guest books without a topic and owner sees no topic badge", async ({
  page,
}) => {
  await page.goto("/admin");
  const types = page.getByRole("region", { name: "Типы встреч" });
  await types.getByLabel("Название").fill(NO_TOPIC_MEETING_TYPE);
  await types.getByLabel("Описание").fill("Разбор задачи вместе с владельцем");
  await types.getByLabel("Длительность (мин)").fill("30");
  await types.getByRole("button", { name: "Сохранить" }).click();
  await expect(
    types
      .locator(".admin-type-item")
      .filter({ hasText: NO_TOPIC_MEETING_TYPE }),
  ).toBeVisible();

  await page.goto("/book");
  await page.getByRole("link", { name: NO_TOPIC_MEETING_TYPE }).click();
  await page
    .getByRole("group", { name: "Даты записи" })
    .getByRole("button", { name: /понедельник, 16 ноября 2026/ })
    .click();
  await page.getByRole("button", { name: /12:00–12:30/ }).click();
  await page.getByLabel("Имя").fill("Игорь");
  await page.getByLabel("Email").fill("igor@example.com");
  await page.getByRole("button", { name: "Подтвердить запись" }).click();
  await expect(
    page
      .locator(".booking-confirmation")
      .getByRole("heading", { name: "Встреча забронирована" }),
  ).toBeVisible();

  await page.goto("/admin");
  const upcoming = page.getByRole("region", { name: "Предстоящие встречи" });
  await upcoming.getByRole("button", { name: "Обновить" }).click();
  const booking = upcoming
    .locator(".booking-card")
    .filter({ hasText: NO_TOPIC_MEETING_TYPE });
  await expect(booking).toBeVisible();
  await expect(booking).toContainText("Игорь");
  await expect(booking.locator(".booking-card__topic")).toHaveCount(0);
  await expect(booking.locator(".booking-card__heading")).not.toContainText(
    /без темы/i,
  );
});
