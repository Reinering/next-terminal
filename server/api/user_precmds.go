package api

import (
	"context"
	"github.com/labstack/echo/v4"
	"next-terminal/server/model"
	"next-terminal/server/service"
)

type UserPreCmdsApi struct{}

func (userPreCmdsApi UserPreCmdsApi) GetEndpoint(c echo.Context) error {
	account, _ := GetCurrentAccount(c)
	id := account.ID

	userPreCmds, err := service.UserPreCmdsService.Get(context.Background(), id)
	if err != nil {
		return err
	}
	return Success(c, userPreCmds)
}

func (userPreCmdsApi UserPreCmdsApi) AddEndpoint(c echo.Context) error {
	var item model.PreCmd
	if err := c.Bind(&item); err != nil {
		return err
	}

	account, _ := GetCurrentAccount(c)
	id := account.ID

	if err := service.UserPreCmdsService.Add(context.Background(), id, item); err != nil {
		return err
	}

	return Success(c, nil)
}

func (userPreCmdsApi UserPreCmdsApi) UpdateEndpoint(c echo.Context) error {
	var items model.PreCmds
	if err := c.Bind(&items); err != nil {
		return err
	}

	account, _ := GetCurrentAccount(c)
	id := account.ID

	if err := service.UserPreCmdsService.Update(context.Background(), id, items); err != nil {
		return err
	}

	return Success(c, nil)
}

func (userPreCmdsApi UserPreCmdsApi) DeleteEndpoint(c echo.Context) error {
	var item model.PreCmd
	if err := c.Bind(&item); err != nil {
		return err
	}

	account, _ := GetCurrentAccount(c)
	id := account.ID

	if err := service.UserPreCmdsService.Delete(context.Background(), id, item); err != nil {
		return err
	}

	return Success(c, nil)
}

func (userPreCmdsApi UserPreCmdsApi) UpdateGroupEndpoint(c echo.Context) error {
	var item model.PreGroup
	if err := c.Bind(&item); err != nil {
		return err
	}

	account, _ := GetCurrentAccount(c)
	id := account.ID

	if err := service.UserPreCmdsService.UpdateGroup(context.Background(), id, item); err != nil {
		return err
	}

	return Success(c, nil)
}

func (userPreCmdsApi UserPreCmdsApi) DeleteGroupEndpoint(c echo.Context) error {
	type Group struct {
		Group string `json:"group"`
	}
	var group Group
	if err := c.Bind(&group); err != nil {
		return err
	}

	account, _ := GetCurrentAccount(c)
	id := account.ID

	if err := service.UserPreCmdsService.DeleteGroup(context.Background(), id, group.Group); err != nil {
		return err
	}

	return Success(c, nil)
}
