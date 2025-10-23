# frozen_string_literal: true

# rubocop:disable Rails/I18nLocaleTexts
class ListsController < ApplicationController
  before_action :set_list, only: %i[show edit update destroy]

  # GET /lists
  def index
    @lists = List.all
  end

  # GET /lists/1
  def show; end

  # GET /lists/new
  def new
    @list = List.new
    @use = params[:use]&.to_sym || :link
  end

  # GET /lists/1/edit
  def edit
    @use = params[:use]&.to_sym || :link
  end

  # POST /lists
  def create
    @list = List.new(list_params)

    if @list.save
      redirect_to @list, notice: 'List was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /lists/1
  def update
    if @list.update(list_params)
      redirect_to @list, notice: 'List was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /lists/1
  def destroy
    @list.destroy
    redirect_to lists_url, notice: 'List was successfully destroyed.'
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_list
    @list = List.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def list_params
    params.expect(list: [:name, { items_attributes: %i[id label position _destroy] }])
  end
end
# rubocop:enable Rails/I18nLocaleTexts
